import { z } from 'zod';
import { zEndpoint } from './zEndpoint';
import { zHttpMethod } from './zHttpMethod';
import { zPath } from './zPath';
import { zAuthorizer } from './zAuthorizer';
import { zName } from './zName';

const zTurbogateSpec = z
  .object({
    meta: z.object({
      /** The name of the API. Should be in `kebab-case`. */
      name: zName,
    }),
    authorizers: z.record(z.string(), zAuthorizer),
    endpoints: z.record(zPath, z.record(zHttpMethod, zEndpoint)),
  })
  // add refinement that ensures all endpoint names are unique
  .refine(
    apiConfig => {
      const endpointNames = new Set<string>();

      for (const endpoint of Object.values(apiConfig.endpoints)) {
        for (const { name } of Object.values(endpoint)) {
          if (endpointNames.has(name)) {
            throw new Error(`Duplicate endpoint name: ${name}`);
          }
          endpointNames.add(name);
        }
      }
      return true;
    },
    { message: 'Duplicate endpoint name' },
  )
  .refine(
    apiConfig => {
      const authorizerNames = Object.keys(apiConfig.authorizers);

      for (const endpoint of Object.values(apiConfig.endpoints)) {
        for (const operation of Object.values(endpoint)) {
          if (operation.authorizer && !authorizerNames.includes(operation.authorizer)) {
            throw new Error(`Authorizer ${operation.authorizer} not found`);
          }
        }
      }
      return true;
    },
    { message: 'Unspecified authorizer found' },
  );

export type TurbogateSpec = z.infer<typeof zTurbogateSpec>;
export { zTurbogateSpec };

// TODO authorizer and lambda names must be unique
