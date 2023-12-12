export type RequestDefinition = {
  body?: Record<string, unknown>;
  pathParameters: Record<string, string | number | boolean>;
  queryParameters: Record<string, string | number | boolean>;
  headers: Record<string, unknown>;
};
