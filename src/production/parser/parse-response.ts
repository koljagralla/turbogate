export function parseResponse<T extends { body: any } | {}>(response: T): T & { body: string | never } {
  if ('body' in response) {
    return {
      ...response,
      body: JSON.stringify(response.body),
    };
  }
  return response as T & { body: never };
}
