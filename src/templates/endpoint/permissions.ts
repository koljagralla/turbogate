import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../local/util/generated-doc-data';

export const permissions = [
  // 'MY_DYNAMO_1_READ',
  // 'MY_DYNAMO_1_WRITE',
  // 'MY_SQS_1_SEND_MESSAGE',
] as const;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'Declares the permissions that your endpoint needs. Defining a permission will require you to provide a corresponding callback in the constructor of your generated turbogate class.',
  expectedSignature: ['export const permissions = [ /* only string values */] as const '],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_REGENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
