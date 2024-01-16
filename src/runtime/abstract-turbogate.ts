import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { ZodObject, z } from 'zod';
import { Authorizer } from '../generator/spec/zAuthorizer';
import { HttpMethod } from '../generator/spec/zHttpMethod';
import { EndpointConfig } from './types/configs/endpoint-config';
import { EnvironmentDefinition } from './types/definitions/environment-defintion';
import { LambdaRequestAuthorizerConfig } from './types/configs/lambda-request-authorizer-config';
import { ReducedNodejsFunctionProps } from './types/reduced-props/reduced-node-js-function-props';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

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

  constructor(
    private readonly scope: Construct,
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
    },
  ) {
    // Ensure zod is extended with openapi
    extendZodWithOpenApi(z);

    // Setup the API Gateway
    this.apiGw = new apigateway.RestApi(scope, this.id('api-gw'), this.params.apiGatewayProps);

    this.resources = {} as any;
    this.operations = {} as any;
    this.authorizer = { lambdaRequestAuthorizer: {} as any } as any;

    this.createResources();
    this.createLambdaRequestAuthorizerInstances();
    this.createOperationResources();
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
    });
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

      const lambdaFn = this.createLambda(operation.name, operation.lambdaDirectoryPath, config.lambda);
      this.operations[operation.name] = { lambdaFn };

      let methodOptions: apigateway.MethodOptions = {};

      if (operation.authorizer) {
        if (operation.authorizer.authorizerType === 'lambdaRequestAuthorizer') {
          methodOptions = {
            authorizationType: apigateway.AuthorizationType.CUSTOM,
            authorizer:
              this.authorizer.lambdaRequestAuthorizer[operation.authorizer.authorizerName].apigatewayRequestAuthorizer,
          };
        } else {
          throw new Error(`Unknown authorizer type: ${operation.authorizer.authorizerType}`);
        }
      }

      this.resources[operation.path].addMethod(
        operation.method,
        new apigateway.LambdaIntegration(lambdaFn, config.integration),
        methodOptions,
      );
    });
  }

  private createLambda(name: string, directoryPath: string, props: ReducedNodejsFunctionProps = {}) {
    const lambdaFn = new NodejsFunction(this.scope, this.id(name, 'lambda'), {
      functionName: this.name(name, 'lambda'),
      entry: path.join(this.params.rootDirectory, `/${directoryPath}/handler.ts`),
      environment: this.createEnvironmentConfig(directoryPath),
      ...props,
    });

    try {
      const permissions = require(path.join(this.params.rootDirectory, `/${directoryPath}/permissions.ts`))
        .permissions as PermissionName[];
      permissions.forEach(permission => {
        this.params.permissions[permission](lambdaFn);
      });
    } catch (e: any) {
      throw new Error(`Missing or corrupted permissions.ts file in ${directoryPath}.`);
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
      throw new Error(`Missing environment variables: ${missingEnvironmentVariables.join(', ')}`);
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
