import { ZodType, z } from 'zod';
import { RequestDefinition } from '../../runtime/types/definitions/request-definition';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../generator/private/generated-doc-data';

/**
 * Use this to define the request schema for your endpoint.
 *
 * Initially generated by turbogate. Won't be touched again by turbogate but read so please only change the schema
 * inside the outer `z.object` to not break code generation.
 */
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
