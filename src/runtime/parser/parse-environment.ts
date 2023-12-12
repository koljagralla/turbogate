import { ZodType } from 'zod';
import { EnvironmentDefinition } from '../types/definitions/environment-defintion';

function parseEnvironment<T>(zEnvironment: ZodType<T, any, EnvironmentDefinition>): T {
  try {
    return zEnvironment.parse(process.env);
  } catch (error: any) {
    throw new Error(`Failed to parse environment: ${error.message}`);
  }
}

export { parseEnvironment };
