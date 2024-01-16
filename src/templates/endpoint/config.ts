import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../generator/util/generated-doc-data';
import { EndpointConfig } from '../../runtime/types/configs/endpoint-config';
import { defaultConfig } from '../_root/config/default-config';

export const config: EndpointConfig = {
  lambda: {
    ...defaultConfig.lambda,
  },
  integration: {
    ...defaultConfig.integration,
  },
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Provides configs for the AWS constructs related to this endpoint.',
  expectedSignature: ['export const config: EndpointConfig'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
