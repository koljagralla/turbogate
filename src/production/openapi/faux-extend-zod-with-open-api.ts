import { z } from 'zod';


/**
 * This mocks the extendZodWithOpenApi method from @asteasolutions/zod-to-openapi. We neither need nor want the
 * zod-to-openapi functions in production code. However, we do want to use the openapi method in our data model
 * definitions. So to not run into runtime errors, we mock the openapi method.
 *
 * @see https://github.com/asteasolutions/zod-to-openapi?tab=readme-ov-file#the-openapi-method
 */
function fauxExtendZodWithOpenApi(zod: typeof z): void {
  (zod.ZodType.prototype as any).openapi = function (this: any, ...args: any[]) {
    return this;
  };
}

// This gets called when this file imported in the handler.ts
fauxExtendZodWithOpenApi(z);

// Export something so we can import this file in the handler.ts
export const _ = undefined;