import { ZodIssueCode, z } from 'zod';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../../generator/private/generated-doc-data';
import { ResponsesDeclaration } from '../../../../runtime/types/response/responses-declaration';

export const http400ValidationError = {
  400: {
    description: 'Validation error',
    schema: z.object({
      validationErrors: z.array(
        z.object({
          code: z.nativeEnum(ZodIssueCode),
          message: z.string(),
          path: z.array(z.string()),
        }),
      ),
    }),
  },
} as const satisfies ResponsesDeclaration;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Provide a common defintion for HTTP 400 response.',
  expectedSignature: ['export const http400ValidationError = {...} as const satisfies ResponsesDeclaration'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.YES_IF_NOT_NEEDED_BUT_CLEAN_DEPENDENCIES,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};
