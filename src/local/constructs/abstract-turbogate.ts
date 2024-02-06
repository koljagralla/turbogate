import { OpenAPIRegistry, OpenApiGeneratorV31, RouteConfig } from '@asteasolutions/zod-to-openapi';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { AnyZodObject, ZodEffects, ZodObject } from 'zod';
import { EndpointConfig } from '../../production/types/configs/endpoint-config';
import { LambdaRequestAuthorizerConfig } from '../../production/types/configs/lambda-request-authorizer-config';
import { EnvironmentDefinition } from '../../production/types/definitions/environment-defintion';
import { ApiDocs } from '../../production/types/docs/api-docs';
import { AuthorizerDocs } from '../../production/types/docs/authorizer-docs';
import { EndpointDocs } from '../../production/types/docs/endpoint-docs';
import { OpenAPIProps } from '../../production/types/docs/openapi-props';
import { ReducedNodejsFunctionProps } from '../../production/types/reduced-props/reduced-node-js-function-props';
import { ResponsesDeclaration } from '../../production/types/response/responses-declaration';
import { Authorizer } from '../spec/zAuthorizer';
import { HttpMethod } from '../spec/zHttpMethod';

export abstract class AbstractTurbogate<
  Resource extends string,
  OperationName extends string,
  LambdaRequestAuthorizerName extends string,
  EnvironmentVariableName extends string,
  PermissionName extends string,
> {
  public readonly apiGw: apigateway.RestApi;
  public readonly resources: Record<Resource, apigateway.Resource>;
  public readonly operations: Record<OperationName, { lambdaFn: NodejsFunction }>;
  public readonly authorizer: {
    lambdaRequestAuthorizer: Record<
      LambdaRequestAuthorizerName,
      { lambdaFn: NodejsFunction; apigatewayRequestAuthorizer: apigateway.RequestAuthorizer }
    >;
  };

  private readonly openapiRegistry = new OpenAPIRegistry();

  constructor(
    private readonly scope: Construct,
    // TODO move to own type
    private readonly params: {
      apiName: string;
      resources: Resource[];
      rootDirectory: string;
      operations: {
        name: OperationName;
        path: Resource;
        method: HttpMethod;
        lambdaDirectoryPath: string;
        authorizer?: {
          authorizerType: Authorizer['type'];
          authorizerName: LambdaRequestAuthorizerName; // add other authorizer name types if more are added
        };
      }[];
      lambdaRequestAuthorizers: { name: LambdaRequestAuthorizerName; lambdaDirectoryPath: string }[];
      environmentVariables: Record<EnvironmentVariableName, string>;
      permissions: Record<PermissionName, (lambdaFn: NodejsFunction) => void>;
      apiGatewayProps?: apigateway.RestApiProps;
      openapi?: OpenAPIProps;
    },
  ) {
    // Setup the API Gateway
    this.apiGw = new apigateway.RestApi(scope, this.id('api-gw'), this.params.apiGatewayProps);

    this.resources = {} as any;
    this.operations = {} as any;
    this.authorizer = { lambdaRequestAuthorizer: {} as any } as any;

    this.createResources();
    this.createLambdaRequestAuthorizerInstances();
    this.createOperationResources();
    this.generateOpenApiSpec();
  }

  /** Creates the resources (in the sense of API Gateway) and stores them in the `resources` property. */
  private createResources() {
    let slashCount = 1;
    while (Object.values(this.resources).length < this.params.resources.length) {
      let resources = this.params.resources.filter(resource => resource.split('/').length - 1 === slashCount);
      resources.forEach(resource => {
        let parentResource =
          slashCount === 1
            ? this.apiGw.root
            : this.resources[resource.substring(0, resource.lastIndexOf('/')) as any as Resource];
        const newResource = parentResource.addResource(resource.substring(resource.lastIndexOf('/') + 1));
        this.resources[resource] = newResource;
      });
      slashCount++;
    }
  }

  /**
   * Creates the lambda function and authorizer instances for each lambda request authorizer and stores them in the
   * `authorizer` property.
   */
  private createLambdaRequestAuthorizerInstances() {
    this.params.lambdaRequestAuthorizers.forEach(lambdaRequestAuthorizer => {
      let config: LambdaRequestAuthorizerConfig;
      try {
        config = require(
          path.join(this.params.rootDirectory, `/${lambdaRequestAuthorizer.lambdaDirectoryPath}/config.ts`),
        ).config as LambdaRequestAuthorizerConfig;
      } catch (e: any) {
        throw new Error(`Missing or corrupted config.ts file in ${lambdaRequestAuthorizer.lambdaDirectoryPath}.`);
      }
      try {
        const lambdaFn = this.createLambda(
          lambdaRequestAuthorizer.name,
          lambdaRequestAuthorizer.lambdaDirectoryPath,
          config.lambda,
        );
        const authorizer = new apigateway.RequestAuthorizer(
          this.scope,
          this.id(lambdaRequestAuthorizer.name, 'authorizer'),
          {
            authorizerName: this.name(lambdaRequestAuthorizer.name, 'authorizer'),
            handler: lambdaFn,
            ...config.requestAuthorizer,
          },
        );

        this.authorizer.lambdaRequestAuthorizer[lambdaRequestAuthorizer.name] = {
          lambdaFn: lambdaFn,
          apigatewayRequestAuthorizer: authorizer,
        };

        const docs = this.loadTS<AuthorizerDocs>('docs', lambdaRequestAuthorizer.lambdaDirectoryPath, 'docs.ts');
        this.openapiRegistry.registerComponent('securitySchemes', lambdaRequestAuthorizer.name, docs);
      } catch (e: any) {
        console.log(`Failed to create lambda request authorizer ${lambdaRequestAuthorizer.name}: ${e.message}`);
        process.exit(1);
      }
    });
  }

  private loadTS<T>(accessor: string, ...relativeFilePathSegments: string[]): T {
    const relativeFilePathJoined = relativeFilePathSegments.join('/');
    const absolutePath = path.join(this.params.rootDirectory, relativeFilePathJoined);
    let content;
    try {
      content = require(absolutePath);
    } catch (e: any) {
      throw new Error(`Failed to load file as TypeScript (${relativeFilePathJoined}): ${e.message}`);
    }
    const value = content[accessor];
    if (value === undefined) {
      throw new Error(`Missing exported ${accessor} in ${relativeFilePathJoined}`);
    }
    return value as T;
  }

  /**
   * Creates the lambda function and links them to the respectives resource for each operatin and stores them in
   * the `operations` property.
   */
  private createOperationResources() {
    this.params.operations.forEach(operation => {
      let config: EndpointConfig;
      try {
        config = require(path.join(this.params.rootDirectory, `/${operation.lambdaDirectoryPath}/config.ts`))
          .config as EndpointConfig;
      } catch (e: any) {
        throw new Error(`Missing or corrupted config.ts file in ${operation.lambdaDirectoryPath}.`);
      }

      try {
        // Create the lambda and add it to the operations registry
        const lambdaFn = this.createLambda(operation.name, operation.lambdaDirectoryPath, config.lambda);
        this.operations[operation.name] = { lambdaFn };

        // Add the authorizer to the operation if it exists
        let methodOptions: apigateway.MethodOptions = {};
        if (operation.authorizer) {
          if (operation.authorizer.authorizerType === 'lambdaRequestAuthorizer') {
            methodOptions = {
              authorizationType: apigateway.AuthorizationType.CUSTOM,
              authorizer:
                this.authorizer.lambdaRequestAuthorizer[operation.authorizer.authorizerName]
                  .apigatewayRequestAuthorizer,
            };
          } else {
            throw new Error(`Unknown authorizer type: ${operation.authorizer.authorizerType}`);
          }
        }

        // Link the lambda to the resource
        this.resources[operation.path].addMethod(
          operation.method,
          new apigateway.LambdaIntegration(lambdaFn, config.integration),
          methodOptions,
        );

        // Add the endpoint to the OpenAPI registry
        const request = this.loadTS<AnyZodObject>('zRequest', operation.lambdaDirectoryPath, 'request.ts');
        const responses = this.loadTS<ResponsesDeclaration>('responses', operation.lambdaDirectoryPath, 'responses.ts');
        const docs = this.loadTS<EndpointDocs>('docs', operation.lambdaDirectoryPath, 'docs.ts');
        const { authorizationScopes } = docs;
        delete docs.authorizationScopes;
        const parsedResponses: RouteConfig['responses'] = {};
        Object.entries(responses).forEach(([statusCode, response]) => {
          if (response.omitInOpenApi) {
            return;
          }
          parsedResponses[statusCode] =
            'schema' in response && response.schema
              ? {
                  description: response.description!,
                  content: {
                    'application/json': {
                      schema: response.schema,
                    },
                  },
                }
              : {
                  description: response.description!,
                };
        });
        this.openapiRegistry.registerPath({
          ...docs,
          method: operation.method.toLowerCase() as any,
          path: operation.path,
          operationId: operation.name,
          request: {
            body:
              request.shape.body._def.typeName === 'ZodUndefined'
                ? undefined
                : {
                    content: {
                      'application/json': {
                        schema: request.shape.body,
                      },
                    },
                  },
            query: this.refinementSaveZodObjectAccess(request.shape.queryParameters),
            headers: this.refinementSaveZodObjectAccess(request.shape.headers),
            params: this.refinementSaveZodObjectAccess(request.shape.pathParameters),
          },
          responses: parsedResponses,
          security: operation.authorizer
            ? [{ [operation.authorizer.authorizerName]: authorizationScopes || [] }]
            : undefined,
        });
      } catch (e: any) {
        console.log(`Failed to setup endpoint lambda ${operation.name}: ${e.message}`);
        process.exit(1);
      }
    });
  }

  /** Can be removed once https://github.com/asteasolutions/zod-to-openapi/issues/198 is resolved. */
  private refinementSaveZodObjectAccess(element: ZodObject<any> | ZodEffects<any>): ZodObject<any> {
    if (element instanceof ZodEffects) {
      return element.sourceType();
    }
    return element;
  }

  private generateOpenApiSpec() {
    const config = this.params.openapi;
    if (!config) {
      return;
    }

    const docs = this.loadTS<ApiDocs>('docs', '', 'docs.ts');
    const generator = new OpenApiGeneratorV31(this.openapiRegistry.definitions);
    const document = generator.generateDocument({
      ...docs,
      openapi: '3.1.0',
    });
    const documentYaml = yaml.dump(document);
    const outputDirectory = config.outputDirectory ?? this.params.rootDirectory;
    fs.mkdirSync(outputDirectory, { recursive: true });
    const fileName = config.fileName ?? 'openapi.yaml';
    const filePath = path.join(outputDirectory, fileName);
    fs.writeFileSync(filePath, documentYaml);
  }

  private createLambda(name: string, directoryPath: string, props: ReducedNodejsFunctionProps = {}) {
    const lambdaFn = new NodejsFunction(this.scope, this.id(name, 'lambda'), {
      functionName: this.name(name, 'lambda'),
      entry: path.join(this.params.rootDirectory, `/${directoryPath}/handler.ts`),
      ...props,
      environment: { ...props.environment, ...this.createEnvironmentConfig(directoryPath) },
    });

    try {
      const permissions = require(path.join(this.params.rootDirectory, `/${directoryPath}/permissions.ts`))
        .permissions as PermissionName[];
      permissions.forEach(permission => {
        try {
          this.params.permissions[permission](lambdaFn);
        } catch (e) {
          throw new Error(
            `Failed to add permission ${permission} to lambda ${name}. Are you sure it is defined in the turbogate constructor call?`,
          );
        }
      });
    } catch (e: any) {
      throw new Error(`Missing or corrupted permissions.ts file in ${directoryPath}.`); // TODO make error message more verbose
    }

    return lambdaFn;
  }

  private createEnvironmentConfig(directoryPath: string): EnvironmentDefinition {
    // Dynamically load the environment schema
    const zEnvironment = require(path.join(this.params.rootDirectory, `/${directoryPath}/environment.ts`))
      .zEnvironment as ZodObject<any>;

    // Extract the environment variables keys from the schema
    const requiredEnvironmentVariableNames = Object.keys(zEnvironment.shape);

    // Check if all environment variables are defined
    const providedEnvironmentVariablesNames = Object.keys(
      this.params.environmentVariables,
    ) as EnvironmentVariableName[];
    const missingEnvironmentVariables = requiredEnvironmentVariableNames.filter(
      requiredEnvironmentVariableName =>
        !providedEnvironmentVariablesNames.includes(requiredEnvironmentVariableName as any),
    );
    if (missingEnvironmentVariables.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingEnvironmentVariables.join(
          ', ',
        )}. Please define them in the turbogate constructor call.`,
      );
    }

    // Reassign for TS to understand what's going on
    const requiredAndVerifiedEnvironmentVariableNames = requiredEnvironmentVariableNames as EnvironmentVariableName[];

    // Build the environment object
    let environment: EnvironmentDefinition = {};
    requiredAndVerifiedEnvironmentVariableNames.forEach(
      requiredEnvironmentVariableName =>
        (environment[requiredEnvironmentVariableName] =
          this.params.environmentVariables[requiredEnvironmentVariableName]),
    );

    return environment;
  }

  private id(id: string, resource?: string) {
    return `${this.params.apiName}-${id}${resource ? '-' + resource : ''}`;
  }

  private name(name: string, resource?: string) {
    return `${this.params.apiName}-${name}${resource ? '-' + resource : ''}`;
  }
}
