import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/private/generated-doc-data';

export const apiGwConfig: apigateway.RestApiProps = {};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Declares the config for the generated API Gateway.',
  expectedSignature: ['export const apiGwConfig: apigateway.RestApiProps'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_REGENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};