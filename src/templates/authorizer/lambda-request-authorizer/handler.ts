import { z } from 'zod';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../local/util/generated-doc-data';
import { _ } from '../../../production/openapi/faux-extend-zod-with-open-api';
import { parseEnvironment } from '../../../production/parser/parse-environment';
import { LambdaAuthorizerInputEvent } from '../../../production/types/missing-aws-types/lambda-authorizer-input-event';
import { LambdaAuthorizerResponse } from '../../../production/types/missing-aws-types/lambda-authorizer-response';
import { LambdaAuthorizerUtil } from '../../../production/util/lambda-authorizer-util';
import { zEnvironment } from './environment';
import { main } from './main';

export const handler = async (event: LambdaAuthorizerInputEvent): Promise<LambdaAuthorizerResponse<any, any>> => {
  _; // This need to be in the code so the fauxExtendZodWithOpenApi is not tree shaken.

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
