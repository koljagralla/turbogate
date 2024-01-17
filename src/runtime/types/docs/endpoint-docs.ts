import { RouteConfig } from '@asteasolutions/zod-to-openapi';

export type EndpointDocs = Pick<
  RouteConfig,
  'summary' | 'description' | 'tags' | 'externalDocs' | 'deprecated' | 'callbacks'
> & {
  /**
   * The values to add to the list of authorization scopes in the `security` field of the OpenAPI spec.
   *
   * @see https://spec.openapis.org/oas/latest.html#oauth2-security-requirement
   */
  authorizationScopes?: string[];
};
