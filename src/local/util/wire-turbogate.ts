import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Ensure Zod is extended with the openapi method
extendZodWithOpenApi(z);

export const wireTurbogate = undefined;
