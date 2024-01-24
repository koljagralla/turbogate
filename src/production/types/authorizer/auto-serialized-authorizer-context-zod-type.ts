import { ZodType } from 'zod';
import { LambdaAuthorizerContext } from '../missing-aws-types/lambda-authorizer-context';

/**
 * This is a type that is used to represent the zod type that defines the context that is expected to be provided
 * by the authorizer. This is not the same as the context field in the authorizers response. The context object in
 * the authorizers response can only contain string values (see {@link LambdaAuthorizerContext }). The context
 * defined by this zod type will automatically be serialied and deserialited between the authorizer and the main
 * lambda.
 *
 * This zod type will also be used to validate the context multiple times. Therefor it should not contain zod
 * transformations as the desiraliazation will fail if the context is not in the expected format.
 */
export type AutoSerializedAuthorizerContextZodType<T extends object> = ZodType<T>;
