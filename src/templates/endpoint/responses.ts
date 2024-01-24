import { http400ValidationError } from '../_root/shared/responses/http-400-validation-error';
import { http500InternalServerError } from '../_root/shared/responses/http-500-internal-server-error';
import { http501NotImplemented } from '../_root/shared/responses/http-501-not-implemented';
import { ResponsesDeclaration } from '../../production/types/response/responses-declaration';
import { InferResponseFromResponsesDeclaration } from '../../production/types/response/infer-response-from-response-declaration';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../local/util/generated-doc-data';
import { z } from 'zod';

export const responses = {
  // Some common responses are already defined for you.
  // You can change them in the shared/responses folder if you want.
  ...http400ValidationError,
  ...http500InternalServerError,
  ...http501NotImplemented,

  // Example for a custom success response
  // 200: {
  //   description: 'Everything is allright.',
  //   schema: z.object({ message: z.string() }),
  // },
} as const satisfies ResponsesDeclaration;

export type Response = InferResponseFromResponsesDeclaration<typeof responses>;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'Defines the responses your endpoint can return. Currently this is only used on TypeScript level in the main.ts. In future releaes this will also be used to generate OpenAPI documentation.',
  expectedSignature: [
    'export const zRequest: ZodType<any, any, RequestDefinition>',
    'export type Request = z.infer<typeof zRequest>;',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
