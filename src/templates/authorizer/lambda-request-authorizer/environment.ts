import { ZodType, z } from 'zod';
import { EnvironmentDefinition } from '../../../production/types/definitions/environment-defintion';
import { Env } from '../../../production/util/env';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../local/util/generated-doc-data';

export const zEnvironment = z.object({
  // MY_ENV_VAR: Env.string,
  // ANOTHER_VAR_THAT_SHOULD_BE_A_NUMBER: Env.number,
}) satisfies ZodType<any, any, EnvironmentDefinition>;

export type Environment = z.infer<typeof zEnvironment>;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'Declares the environment variables that your authorizer needs. All declared environment variables will be extracted and validated and be available in the `environment` parameter of your authorizers `main.ts`. The source data for the enviornment variables will be provided in the constructor of your generated turbogate class.',
  expectedSignature: [
    'export const zEnvironment: ZodType<any, any, EnvironmentDefinition>',
    'export type Environment = z.infer<typeof zEnvironment>;',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_REGENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};