import { ZodType } from 'zod';
import { RawRequest } from '../types/raw-request';

function parseAuthorizerContext<C>(zContext: ZodType<C>, event: RawRequest) {
  try {
    // @ts-ignore
    const serializedContext = event.requestContext?.authorizer?.serializedContext;
    const deserializedContext = JSON.parse(serializedContext);
    return zContext.parse(deserializedContext);
  } catch (error: any) {
    throw new Error(`Failed to parse authorizer context: ${error.message}`);
  }
}

export { parseAuthorizerContext };
