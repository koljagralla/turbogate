import { OpenAPIObjectConfigV31 } from '@asteasolutions/zod-to-openapi/dist/v3.1/openapi-generator';

export type ApiDocs = Omit<OpenAPIObjectConfigV31, 'openapi' | 'paths' | 'components' | 'webhooks' | 'security'>;
