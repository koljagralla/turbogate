import { z, ZodAny, ZodString, ZodTypeAny } from 'zod';
import { HttpStatus } from '../../http-status-codes';
import { SimpleZodArray, SimpleZodObject } from '../../simple-zod-object';

/**
 * Declaration of all possible responses for an endpoint.
 * This is used to type validate the responses in the `main.ts` of an endpoint and to generate the OpenAPI spec.
 */
export type ResponsesDeclaration = {
  [statusCode in HttpStatus]?: ResponseDeclaration;
};

type ResponseDeclaration = {
  /** A description of the response, will be used in the OpenAPI spec. */
  description?: string;
  /** The response body schema */
  schema?: ZodTypeAny;
  /** If set to true, the response will not be included in the OpenAPI spec. */
  omitInOpenApi?: boolean;
};
