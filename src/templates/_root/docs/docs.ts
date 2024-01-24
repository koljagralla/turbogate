import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../local/util/generated-doc-data';
import { ApiDocs } from '../../../production/types/docs/api-docs';

export const docs: ApiDocs = {
  info: {
    title: 'My API',
    version: '0.0.0',
  },
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Declare docs the API that are parsable by turbogate to be used in the generated OpenAPI specs.',
  expectedSignature: ['export const config: ApiDocs'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
