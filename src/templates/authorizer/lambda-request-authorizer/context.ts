import { ZodType, z } from 'zod';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/private/generated-doc-data';
import { LambdaAuthorizerContext } from '../../../runtime/types/missing-aws-types/lambda-authorizer-context';

export const zContext = z.object({
  // MY_CONTEXT_VALUE: z.string(),
}) satisfies ZodType<LambdaAuthorizerContext, any, LambdaAuthorizerContext>;

export type Context = z.infer<typeof zContext>;

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Defines the data ("context") the authorizer is expected to provide upon successful authorization.',
  expectedSignature: [
    'export const zContext: ZodType<LambdaAuthorizerContext, any, LambdaAuthorizerContext>',
    'export type Context = z.infer<typeof zContext>;',
  ],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_GENERATED_CODE_WILL_BREAK,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};