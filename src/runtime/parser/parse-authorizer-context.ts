import { AuthorizerContextDefintion } from '../types/definitions/authorizer-context-defintion';
import { RawRequest } from '../types/raw-request';
import { LinearZodType } from '../types/linear-zod-type';

function parseAuthorizerContext<AC extends AuthorizerContextDefintion>(
  zAuthorizerContext: LinearZodType<AC>,
  event: RawRequest,
) {
  try {
    // @ts-ignore
    const authorizerContext = event.requestContext.authorizer;
    return zAuthorizerContext.parse(authorizerContext);
  } catch (error: any) {
    throw new Error(`Failed to parse authorizer context: ${error.message}`);
  }
}

export { parseAuthorizerContext };
