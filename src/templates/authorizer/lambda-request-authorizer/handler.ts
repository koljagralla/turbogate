import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/private/generated-doc-data';
import { parseEnvironment } from '../../../runtime/parser/parse-environment';
import { LambdaAuthorizerInputEvent } from '../../../runtime/types/missing-aws-types/lambda-authorizer-input-event';
import { LambdaAuthorizerResponse } from '../../../runtime/types/missing-aws-types/lambda-authorizer-response';
import { zEnvironment } from './environment';
import { main } from './main';

export const handler = async (event: LambdaAuthorizerInputEvent): Promise<LambdaAuthorizerResponse<any, any>> => {
  const environment = parseEnvironment(zEnvironment);

  return main(environment, event);
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'The entrypoint for this authorizers lambda handler. Performs parsing and validation and injects the results into the main function.',
  expectedSignature: [
    'export const handler: async (event: LambdaAuthorizerInputEvent): Promise<LambdaAuthorizerResponse<any, any>>',
  ],
  canBeEdited: Editability.NO_INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};
