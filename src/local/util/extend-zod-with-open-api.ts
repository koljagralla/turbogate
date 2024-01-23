import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// This gets called when this file imported at the top of your turbogate entrypoint file.
extendZodWithOpenApi(z);

// Export something so we can import this file.
export const handleExtendZodWithOpenApi = undefined;
