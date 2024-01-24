import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../local/util/generated-doc-data';
import { LambdaAuthorizerInputEvent } from '../../../production/types/missing-aws-types/lambda-authorizer-input-event';
import { Context } from './context';
import { Environment } from './environment';

export async function main(
  environment: Environment,
  event: LambdaAuthorizerInputEvent,
): Promise<['accept', Context] | ['deny']> {
  // // Example minimal implementation:

  // // Extract relevant information from the event
  // const authHeaderValue = event.headers['my-custom-auth-header'];

  // // Check if the auth header is what we expect
  // if (authHeaderValue === 'my-expected-auth-value') {
  //   // Grant access to the endpoint, include the required context
  //   const context = {
  //     myContextValue: 'my-context-value',
  //   };
  //   return ['accept', context];
  // }

  // // Deny access to the endpoint
  // return ['deny'];

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
