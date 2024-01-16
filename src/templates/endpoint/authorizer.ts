import { z } from 'zod';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../generator/util/generated-doc-data';

export const zAuthorizerContext = z.undefined();
export type AuthorizerContext = void;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'This file links your endpoint to the authorizer so a validated authorizer context can be provided in main.ts if an authorizer is specified.',
  canBeEdited: Editability.NO_REGENERATED,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};