import { HttpStatus } from '../../runtime/http-status-codes';
import { AuthorizerContext } from './authorizer';
import { Environment } from './environment';
import { Request } from './request';
import { Response } from './responses';
import { Context } from 'aws-lambda';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../generator/private/generated-doc-data';

export async function main(
  environment: Environment,
  request: Request,
  authorizerContext: AuthorizerContext,
  lambdaContext: Context,
): Promise<Response> {
  // Replace this with your business logic.
  return {
    statusCode: HttpStatus.NotImplemented,
  };
}

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'This is the main function of the endpoint. Use this to implement your custom business logic. All provided parameters have been prevalidated.',
  expectedSignature: [
    'export async function main( environment: Environment, request: Request, authorizerContext: AuthorizerContext, ): Promise<Response>',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
