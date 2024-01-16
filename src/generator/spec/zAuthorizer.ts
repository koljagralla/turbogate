import { z } from 'zod';

const zAuthorizer = z.object({
  type: z.literal('lambdaRequestAuthorizer'),
});
export type Authorizer = z.TypeOf<typeof zAuthorizer>;
export { zAuthorizer };
