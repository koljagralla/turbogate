import { copyTemplate } from '../util/copy-template-directory';
import { TurbogateSpec, zTurbogateSpec } from '../spec/zTurbogateSpec';
import * as fs from 'fs';
import path from 'path';
import { Authorizer } from '../spec/zAuthorizer';
import { HttpMethod } from '../spec/zHttpMethod';
import { Deletability, Editability, GeneratedCodeDisclaimer, RecreationBehavior } from '../util/generated-doc-data';
import { buildGeneratedCodeDisclaimerComment } from '../util/build-generated-doc-disclaimer-comment';

export type ApiBuilderConfig = {
  rootDirectory: string;
  configFileName: string;
  endpointStructure: 'byResource' | 'allTogether';
};
export class ApiBuilder {
  constructor(private readonly config: ApiBuilderConfig) {}

  private apiConfig: TurbogateSpec;
  private createdLambdaRequestAuthorizers: Set<string> = new Set();

  private readonly templateFolderPath = path.join(__dirname, '../../templates');

  private readonly usedResources: Set<string> = new Set();
  private readonly allResources: Set<string> = new Set();
  private readonly operations: {
    name: string;
    path: string;
    method: HttpMethod;
    lambdaDirectoryPath: string;
    authorizer?: {
      authorizerType: string;
      authorizerName: string;
    };
  }[] = [];

  private readonly environmentFilePaths: string[] = [];
  private readonly permissionFilePaths: string[] = [];

  /**
   * Copies and adapts all templates. Creates severeal registries that are used to build the turbogate file.
   * Finally builds the turbogate file.
   */
  public async build(): Promise<void> {
    const apiConfig = await this.loadApiConfig();
    this.apiConfig = apiConfig;
    const endpointTemplateFolderPath = path.join(this.templateFolderPath, 'endpoint');

    this.copyConfigTemplates();
    this.copyShared();
    this.copyApiDocs();

    // Iterates the paths
    Object.entries(apiConfig.endpoints).forEach(([endpointPath, endpoint]) => {
      // Register the resource
      this.registerResource(endpointPath);

      // Iterate the paths' methods
      Object.entries(endpoint).forEach(([method, operationDeclaration]) => {
        // Copy the endpoint template to the operations folder
        const fullOperationPath = this.getOperationPath(endpointPath, operationDeclaration.name, 'full');
        copyTemplate(
          endpointTemplateFolderPath,
          fullOperationPath,
          this.config.endpointStructure === 'allTogether' ? 2 : 3,
        );

        // Register the permissions and environment files
        const relativeOperationPath = this.getOperationPath(endpointPath, operationDeclaration.name, 'relative');
        this.environmentFilePaths.push(`${relativeOperationPath}/environment.ts`);
        this.permissionFilePaths.push(`${relativeOperationPath}/permissions.ts`);

        // Handle the endpoints authorizer
        if (operationDeclaration.authorizer) {
          this.handleAuthorizer(
            operationDeclaration.authorizer,
            apiConfig.authorizers[operationDeclaration.authorizer],
            fullOperationPath,
          );
        } else {
          this.handleNoAuthorizer(fullOperationPath);
        }

        // Register the operation
        const operation: any = {
          name: operationDeclaration.name,
          path: endpointPath,
          method: method as HttpMethod,
          lambdaDirectoryPath: fullOperationPath.replaceAll(this.config.rootDirectory, ''),
          authorizer: operationDeclaration.authorizer
            ? {
                // TODO if more than the lambda request authorizer is added, this needs to be changed
                authorizerType: 'lambdaRequestAuthorizer',
                authorizerName: operationDeclaration.authorizer,
              }
            : undefined,
        };
        this.operations.push(operation);
      });
    });

    this.buildTurbogateFile();
  }

  private copyConfigTemplates(): void {
    const rootTemplateFolderPath = path.join(this.templateFolderPath, '_root/config');
    copyTemplate(`${rootTemplateFolderPath}`, `${this.config.rootDirectory}/config`);
  }

  private copyShared(): void {
    const sharedFolderPath = path.join(this.templateFolderPath, '_root/shared');
    copyTemplate(`${sharedFolderPath}`, `${this.config.rootDirectory}/shared`);
  }

  private copyApiDocs(): void {
    const sharedFolderPath = path.join(this.templateFolderPath, '_root/docs');
    copyTemplate(`${sharedFolderPath}`, `${this.config.rootDirectory}`);

    // TODO this is a quick and dirty to replace the API name in the docs.ts file, should probably be a function in copyTemplate
    const content = fs.readFileSync(`${this.config.rootDirectory}/docs.ts`, 'utf-8');
    const contentWithCorrectApiName = content.replace(
      'My API',
      this.apiConfig.meta.name.replace('-', ' ').toUpperCase(),
    );
    fs.writeFileSync(`${this.config.rootDirectory}/docs.ts`, contentWithCorrectApiName);
  }

  /** Registers a resource and all its parent resources. */
  private registerResource(resourcePath: string): void {
    this.usedResources.add(resourcePath);
    let segments = resourcePath.split('/');
    segments.shift();
    while (segments.length > 0) {
      this.allResources.add('/' + segments.join('/'));
      segments.pop();
    }
  }

  /** Creates an `authorizer.ts` file in the given operation path that configures no authorizer. */
  private handleNoAuthorizer(operationPath: string): void {
    const noAuthorizerTemplate = `\
${buildGeneratedCodeDisclaimerComment(authorizerGeneratedCodeDisclaimer)}
import { z } from 'zod';

export const zAuthorizerContext = z.undefined();
export type AuthorizerContext = void;`;
    fs.writeFileSync(`${operationPath}/authorizer.ts`, noAuthorizerTemplate);
  }

  /** Creates an `authorizer.ts` file in the given operation path that configures the given authorizer. */
  private handleAuthorizer(authorizerName: string, authorizer: Authorizer, operationPath: string): void {
    switch (authorizer.type) {
      case 'lambdaRequestAuthorizer':
        // Create the authorizer if it doesn't exist yet
        if (!this.createdLambdaRequestAuthorizers.has(authorizerName)) {
          // Copy the authorizer template to the authorizers folder
          const thisAuthorizerDirectoryPathFull = this.getAuthorizerPath(authorizerName, 'full');
          const authorizerTemplateFolderPath = path.join(
            this.templateFolderPath,
            'authorizer/lambda-request-authorizer',
          );
          copyTemplate(authorizerTemplateFolderPath, thisAuthorizerDirectoryPathFull, 2);

          // Register the environment and permissions files
          const thisAuthorizerDirectoryPathRelative = this.getAuthorizerPath(authorizerName, 'relative');
          this.environmentFilePaths.push(`${thisAuthorizerDirectoryPathRelative}/environment.ts`);
          this.permissionFilePaths.push(`${thisAuthorizerDirectoryPathRelative}/permissions.ts`);

          // Registrer the authorizer so it doesn't get created again
          this.createdLambdaRequestAuthorizers.add(authorizerName);
        }
        const authorizerLinkTemplate = `\
${buildGeneratedCodeDisclaimerComment(authorizerGeneratedCodeDisclaimer)}
import { z } from 'zod';
import { zContext } from '../../${
          this.config.endpointStructure === 'byResource' ? '../' : ''
        }authorizer/${authorizerName}/context';

export const zAuthorizerContext = zContext;
export type AuthorizerContext = z.infer<typeof zAuthorizerContext>;`;
        fs.writeFileSync(`${operationPath}/authorizer.ts`, authorizerLinkTemplate);
        break;

      default:
        throw new Error(`Unknown authorizer type: ${authorizer.type}`);
    }
  }

  private getAuthorizerPath(authorizerName: string, type: 'full' | 'relative'): string {
    const base = type === 'full' ? this.config.rootDirectory : '.';
    return `${base}/authorizer/${authorizerName}`;
  }

  private getOperationPath(endpointPath: string, operationName: string, type: 'full' | 'relative'): string {
    const base = type === 'full' ? this.config.rootDirectory : '.';
    if (this.config.endpointStructure === 'allTogether') {
      return `${base}/endpoints/${operationName}`;
    } else {
      // If the endpoint structure is byResource, the first segment of the endpoint path is used as the resource name.
      // If none is present, use `_` as the resource name to indicate root.
      const endpointSegments = endpointPath.split('/');
      const resourceName = endpointSegments.length > 1 ? endpointSegments[1] : '_';
      const resourceFolderPath = `${base}/endpoints/${resourceName}`;
      return `${resourceFolderPath}/${operationName}`;
    }
  }

  private async loadApiConfig(): Promise<TurbogateSpec> {
    try {
      const ts = await import(this.config.rootDirectory + '/' + this.config.configFileName);
      return zTurbogateSpec.parse(ts.default);
    } catch (e) {
      throw new Error(
        `Could not load config file '${this.config.configFileName}' from '${this.config.rootDirectory}'.`,
      );
    }
  }

  private printAsJsObject(data: Record<string, string | number | boolean | object>): string {
    return `\
{
${Object.entries(data)
  .map(
    ([key, value]) =>
      `  ${key}: ${typeof value === 'object' ? this.printAsJsObject(value as any) : JSON.stringify(value)},`,
  )
  .join('\n')}
}`;
  }

  private buildTurbogateFile() {
    const allResources = Array.from(this.allResources).sort();
    const operationNames = this.operations.map(operation => operation.name).sort();
    const lambdaRequestAuthorizerNames = Array.from(this.createdLambdaRequestAuthorizers).sort();

    // During the previous steps, the environment and permission files were registered.
    // Now we create the import statements for them so we can use them in the turbogate file.
    const environmentTypesNames: string[] = [];
    const environmentTypesImportStatements: string[] = [];
    this.environmentFilePaths.forEach((environmentFilePath, index) => {
      const environmentTypeName = `Environment${index + 1}`;
      environmentTypesNames.push(environmentTypeName);
      environmentTypesImportStatements.push(
        `import { Environment as ${environmentTypeName} } from '${environmentFilePath.replace('.ts', '')}';`,
      );
    });
    const permissionConstNames: string[] = [];
    const permissionConstImportStatements: string[] = [];
    this.permissionFilePaths.forEach((permissionFilePath, index) => {
      const permissionConstName = `permissions${index + 1}`;
      permissionConstNames.push(permissionConstName);
      permissionConstImportStatements.push(
        `import { permissions as ${permissionConstName} } from '${permissionFilePath.replace('.ts', '')}';`,
      );
    });

    // Create the lambda request authorizer objects
    const lambdaAuthorizers = lambdaRequestAuthorizerNames.map(
      authorizer => `\
{
					name: '${authorizer}',
					lambdaDirectoryPath: 'authorizer/${authorizer}',
				}`,
    );

    let name = this.apiConfig.meta.name.replace(/-./g, x => x[1].toUpperCase());
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const template = `\
${buildGeneratedCodeDisclaimerComment(mainGeneratedCodeDisclaimer)}
import { Construct } from 'constructs';
import { AbstractTurbogate, OpenAPIProps, PermissionCallback, handleExtendZodWithOpenApi } from 'turbogate/local';
import { z } from 'zod';
import { apiGwConfig } from "./config/api-gw-config";
${environmentTypesImportStatements.join('\n')}
${permissionConstImportStatements.join('\n')}

type Resource = ${allResources.map(resource => `'${resource}'`).join(' | ')};
type OperationName = ${operationNames.map(operation => `'${operation}'`).join(' | ')};
type LambdaRequestAuthorizerName = ${lambdaRequestAuthorizerNames.map(lran => `'${lran}'`).join(' | ') || 'never'};
type EnvironmentVariableName = keyof (${environmentTypesNames.join(' & ')});
type PermissionName = ${permissionConstNames.map(permission => `(typeof ${permission})[number]`).join(' | ')};
export class ${name}Turbogate extends AbstractTurbogate<
	Resource,
	OperationName,
	LambdaRequestAuthorizerName,
  EnvironmentVariableName,
  PermissionName
> {
	constructor(
    scope: Construct,
    params: { 
      /**
       * Use this param to inject the values to bind to the environment variables you declared in your environment.ts files.
       */
      environment: Record<EnvironmentVariableName, string>,
      /**
       * Use this param to inject the callbacks for the permissions you declared in your permissions.ts files.
       */
      permissions: Record<PermissionName, PermissionCallback>,
      /**
       * Use this to override the API name from the spec file.
       * Useful if you want to deploy the same turbogate twice in the same account as the API name is used as a base for all
       * resource IDs and thus needs to be unique accross all instances of this turbogate.
       */
      apiName?: string,

      /**
       * Set this to enable the OpenAPI documentation generation. Pass in an empty object to generate with default values.
       */
      openapi?: OpenAPIProps,
    }
  ) {

    const { apiName, environment, permissions, openapi } = params;

		super(scope, {
      apiName: apiName || '${this.apiConfig.meta.name}',
      resources: [${allResources.map(resource => `'${resource}'`).join(', ')}],
			rootDirectory: __dirname,
      operations: [
        ${this.operations.map(operation => this.printAsJsObject(operation)).join(',\n\t\t\t\t')}
      ],
			lambdaRequestAuthorizers: [
        ${lambdaAuthorizers.join(',\n\t\t\t\t')}
			],
      environmentVariables: environment,
      permissions,
      apiGatewayProps: apiGwConfig,
      openapi,
		});
	}
}`;

    fs.writeFileSync(`${this.config.rootDirectory}/${this.apiConfig.meta.name}-turbogate.ts`, template);
  }
}

const authorizerGeneratedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'This file links your endpoint to the authorizer so a validated authorizer context can be provided in main.ts if an authorizer is specified.',
  canBeEdited: Editability.NO_REGENERATED,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};

const mainGeneratedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'This is the main file of your turbogate API. It provides the AbstractTurbogate with all necessary data to create and wire the resources needed for your API during synth.',
  canBeEdited: Editability.NO_REGENERATED,
  willBeRecreated: RecreationBehavior.ON_EVERY_TURBOGATE_BUILD,
};
