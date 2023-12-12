import { z } from 'zod';

export const zName = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Name must be kebab-case');
