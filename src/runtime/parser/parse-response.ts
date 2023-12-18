export function parseResponse<T extends { body: any } | {}>(response: T): T & { body: string | void } {
  if ('body' in response) {
    return {
      ...response,
      body: response.body !== undefined ? JSON.stringify(response.body) : undefined,
    };
  }
  return response as T & { body: never };
}
