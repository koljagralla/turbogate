import { z } from 'zod';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../../generator/util/generated-doc-data';
import { ResponsesDeclaration } from '../../../../runtime/types/response/responses-declaration';

export const http500InternalServerError = {
  500: {
    description: 'Internal server error',
    schema: z.any(),
  },
} as const satisfies ResponsesDeclaration;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Provide a common defintion for HTTP 500 response.',
  expectedSignature: ['export const http500InternalServerError = {...} as const satisfies ResponsesDeclaration'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.YES_IF_NOT_NEEDED_BUT_CLEAN_DEPENDENCIES,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};
