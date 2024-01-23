import { z, ZodTypeAny } from 'zod';

// TODO remove and use zod directly
export type SimpleZodObject<T> = z.ZodObject<any, any, z.ZodTypeAny, T, T>;
export type SimpleZodArray<T extends ZodTypeAny> = z.ZodArray<T, 'many'>;
