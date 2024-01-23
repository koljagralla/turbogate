import { OpenAPIObjectConfigV31 } from '@asteasolutions/zod-to-openapi/dist/v3.1/openapi-generator';

export type ApiDocs = Pick<OpenAPIObjectConfigV31, 'info' | 'externalDocs' | 'tags' | 'servers'>;
