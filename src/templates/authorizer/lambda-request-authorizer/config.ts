import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../local/util/generated-doc-data';
import { LambdaRequestAuthorizerConfig } from '../../../production/types/configs/lambda-request-authorizer-config';
import { defaultConfig } from '../../_root/config/default-config';

export const config: LambdaRequestAuthorizerConfig = {
  lambda: {
    ...defaultConfig.lambda,
  },
  requestAuthorizer: {
    ...defaultConfig.requestAuthorizer,
  },
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Provides configs for the AWS constructs related to this authorizer.',
  expectedSignature: ['export const config: LambdaRequestAuthorizerConfig'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
