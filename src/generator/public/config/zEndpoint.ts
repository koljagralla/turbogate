import { z } from 'zod';

const zEndpoint = z.object({
  /**
   * The name of this endpoint. Should be `kebap-case`. Will be used to name several derived resources
   * (directories, files, lambdas etc.)
   */
  name: z.string(), // TODO kebab-case regex
  /**
   * The authorizer to use for this endpoint. The string value is the name of the authorizer in the `authorizers`
   * object.
   */
  authorizer: z.string().optional(),
});

export type Endpoint = z.TypeOf<typeof zEndpoint>;
export { zEndpoint };
