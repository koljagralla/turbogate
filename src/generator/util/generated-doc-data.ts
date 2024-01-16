export enum Editability {
  INTENDED_IF_SIGNATURE_REMAINS = 'Yes, editing this file is intended. Please ensure to preserve the signature though.',
  NO_INTENDED_IF_SIGNATURE_REMAINS = 'File could technically be edited, as long as the export signature remains. However, editing this file is not intended usage.',
  NO_REGENERATED = 'No, this file is regenrated with each turbogate build execution.',
}

export enum Deletability {
  NO_CDK_SYNTH_WILL_FAIL = 'No, CDK synth will fail because this file is dynamically loaded.',
  NO_GENERATED_CODE_WILL_BREAK = 'No, generated code will break (so technically yes, if you fix loads of errors but you probably should not).',
  NO_REGENERATED_CODE_WILL_BREAK = "No, code that is regenerated on every `turbogate build` call will break, so fixing broken code after deleting this won't make sense.",
  YES_IF_NOT_NEEDED_BUT_CLEAN_DEPENDENCIES = "If you don't need this file you can delete it and fix the depending generated code manually.",
  NO_ENTRYPOINT = 'No, this file is the entrypoint for turbogate code generation. If you delete this file you will loose the ability to generate code for this API.',
}

export enum RecreationBehavior {
  ON_EVERY_TURBOGATE_BUILD = 'This file will automatically be recreated on every turbogate build.',
  ON_TURBOGATE_BUILD_WHEN_DELETED = 'Yes, if you delete this file and run `turbogate build` it will be recreated.',
  ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE = 'If you delete this file and run `turbogate build` a boilerplate version of this file will be recreated.',
}

export type GeneratedCodeDisclaimer = {
  purpose?: string;
  expectedSignature?: string[];
  canBeEdited?: Editability;
  canBePermanentlyDeleted?: Deletability;
  willBeRecreated?: RecreationBehavior;
};
