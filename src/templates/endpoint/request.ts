import { ZodType, z } from 'zod';
import { RequestDefinition } from '../../production/types/definitions/request-definition';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../local/util/generated-doc-data';

export const zRequest = z.object({
  body: z.undefined(),
  pathParameters: z.object({}),
  queryParameters: z.object({}),
  headers: z.object({}),
}) satisfies ZodType<any, any, RequestDefinition>;

export type Request = z.infer<typeof zRequest>;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Defines the reuqest your endpoint expects.',
  expectedSignature: [
    'export const zRequest: ZodType<any, any, RequestDefinition>',
    'export type Request = z.infer<typeof zRequest>;',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
