import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../local/util/generated-doc-data';
import { EndpointDocs } from '../../production/types/docs/endpoint-docs';

export const docs: EndpointDocs = {
  // Example docs:
  // summary: "Creates a new item",
  // description: "Creates a new item in the database. The ID of the item is generated by the database and returned in the response.",
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Declare docs for this endpoint that are parsable by turbogate to be used in the generated OpenAPI specs.',
  expectedSignature: ['export const config: EndpointDocs'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
