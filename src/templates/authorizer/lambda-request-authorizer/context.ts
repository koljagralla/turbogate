import { SomeZodObject, ZodObject, ZodType, z } from 'zod';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/private/generated-doc-data';
import { AutoSerializedAuthorizerContextZodType } from '../../../runtime/types/authorizer/auto-serialized-authorizer-context-zod-type';

export const zContext = z.object({
  // myContextValue: z.string(),
  // myOtherContextValue: z.object({/**... */})
}) satisfies AutoSerializedAuthorizerContextZodType<any>;

export type Context = z.infer<typeof zContext>;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'Defines the data ("context") the authorizer is expected to provide upon successful authorization. This value will automatically be serialized, deserialized and validated by turbogate when it is passed between authorizer and main lambda.',
  expectedSignature: [
    'export const zContext: ZodType<LambdaAuthorizerContext, any, LambdaAuthorizerContext>',
    'export type Context = z.infer<typeof zContext>;',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};
