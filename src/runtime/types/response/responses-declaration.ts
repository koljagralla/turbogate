import { z, ZodAny, ZodString, ZodTypeAny } from 'zod';
import { HttpStatus } from '../../http-status-codes';
import { SimpleZodArray, SimpleZodObject } from '../../simple-zod-object';

// TODO Docs
export type ResponsesDeclaration = {
  [statusCode in HttpStatus]?: ResponseDeclaration;
};

// Splitting into multiple types is necessary for TS to infer correctly.
type ResponseDeclaration = ResponseDeclarationWithBody | ResponseDeclarationWithoutBody;
type ResponseDeclarationWithBody = {
  description: string;
  schema: ZodTypeAny;
};
type ResponseDeclarationWithoutBody = { description: string };
