import { z } from 'zod';

/** The HTTP method to use for the endpoint. */
const zHttpMethod = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

export type HttpMethod = z.TypeOf<typeof zHttpMethod>;
export { zHttpMethod };
