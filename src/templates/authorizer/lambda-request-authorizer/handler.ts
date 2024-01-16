import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/util/generated-doc-data';
import { parseEnvironment } from '../../../runtime/parser/parse-environment';
import { LambdaAuthorizerInputEvent } from '../../../runtime/types/missing-aws-types/lambda-authorizer-input-event';
import { LambdaAuthorizerResponse } from '../../../runtime/types/missing-aws-types/lambda-authorizer-response';
import { LambdaAuthorizerUtil } from '../../../runtime/util/lambda-authorizer-util';
import { zEnvironment } from './environment';
import { main } from './main';

export const handler = async (event: LambdaAuthorizerInputEvent): Promise<LambdaAuthorizerResponse<any, any>> => {
  const environment = parseEnvironment(zEnvironment);

  const result = await main(environment, event);
  if (result[0] === 'accept') {
    const serializedContext = JSON.stringify(result[1]);
    return LambdaAuthorizerUtil.grantAccessResponse({ serializedContext });
  } else {
    return LambdaAuthorizerUtil.denyAccessResponse();
  }
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
