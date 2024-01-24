import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../local/util/generated-doc-data';
import { AuthorizerDocs } from '../../../production/types/docs/authorizer-docs';

export const docs: AuthorizerDocs = {
  // Example docs for JWT Bearer auth.
  // See https://spec.openapis.org/oas/latest.html#security-scheme-object
  type: 'http',
  scheme: 'bearer',
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'Declare docs for this authorizer that are parsable by turbogate to be used in the generated OpenAPI specs. Turbogate will create a security scheme from the provided info and link it to every endpoint protected by this authorizer. If you need to add a custom security scheme not supported by OpenAPI just provide any string record. Doing so might result in invalid OpenAPI spec though.',
  expectedSignature: ['export const config: AuthorizerDocs'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
