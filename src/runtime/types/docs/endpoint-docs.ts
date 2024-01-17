import { RouteConfig } from '@asteasolutions/zod-to-openapi';

export type EndpointDocs = Pick<
  RouteConfig,
  'summary' | 'description' | 'tags' | 'externalDocs' | 'deprecated' | 'callbacks'
>;
