import { z } from 'zod';
import { ResponsesDeclaration } from './responses-declaration';

// TODO Docs
export type InferResponseFromResponsesDeclaration<T extends ResponsesDeclaration> =
  AllDeclaredResponsesAsRecord<T>[keyof AllDeclaredResponsesAsRecord<T>];
type AllDeclaredResponsesAsRecord<T extends ResponsesDeclaration> = {
  [StatusCode in keyof T]: T[StatusCode] extends { schema: any }
    ? {
        statusCode: StatusCode;
        body: z.infer<T[StatusCode]['schema']>;
      }
    : {
        statusCode: StatusCode;
      };
};
