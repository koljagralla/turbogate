import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/private/generated-doc-data';
import { LambdaAuthorizerInputEvent } from '../../../runtime/types/missing-aws-types/lambda-authorizer-input-event';
import { LambdaAuthorizerResponse } from '../../../runtime/types/missing-aws-types/lambda-authorizer-response';
import { LambdaAuthorizerUtil } from '../../../runtime/util/lambda-authorizer-util';
import { Context } from './context';
import { Environment } from './environment';

export async function main(
  environment: Environment,
  event: LambdaAuthorizerInputEvent,
): Promise<LambdaAuthorizerResponse<Context, any>> {
  /*
  // Example minimal implementation:

  // Extract relevant information from the event
  const authHeaderValue = event.headers['my-custom-auth-header'];

  // Check if the auth header is what we expect
  if (authHeaderValue === 'my-expected-auth-value') {

    // Grant access to the endpoint, include the required context
    return LambdaAuthorizerUtil.grantAccess(event.methodArn, {
      MY_CONTEXT_VALUE: 'my-context-value',
    });
  }

  // Deny access to the endpoint
  return LambdaAuthorizerUtil.denyAccess(event.methodArn);
  */

  throw new Error('Not implemented');
}

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'This is the main function of the lambda authorizer. Use this to implement your custom authorization logic. All provided parameters have been prevalidated.',
  expectedSignature: [
    'export async function main( environment: Environment, event: LambdaAuthorizerInputEvent, ): Promise<LambdaAuthorizerResponse<Context, any>>',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
