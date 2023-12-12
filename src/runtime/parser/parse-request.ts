import { SimpleZodObject } from '../simple-zod-object';
import { RawRequest } from '../types/raw-request';

function parseRequest<T>(zRequest: SimpleZodObject<T>, rawRequest: RawRequest): T {
  const request = {
    body: rawRequest.body ? JSON.parse(rawRequest.body) : undefined,
    queryParameters: rawRequest.queryStringParameters ? rawRequest.queryStringParameters : {},
    pathParameters: rawRequest.pathParameters ? rawRequest.pathParameters : {},
    headers: rawRequest.headers ? rawRequest.headers : {},
  };
  return zRequest.parse(request);
}

export { parseRequest };
