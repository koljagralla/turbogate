import { z } from 'zod';
import { EnvironmentDefinition } from '../types/definitions/environment-defintion';

/**
 * Defines Zod types for configuring the environment. Each data type accepts a string representation of the value
 * and converts it to the appropriate type when parsing.
 */
export class Env {
  /** Converts the string 'true' to true and 'false' to false. */
  public static readonly boolean = z.string().transform(v => {
    if (v === 'true') {
      return true;
    } else if (v === 'false') {
      return false;
    }
    throw new Error(`${v} is not parsable to boolean.`);
  });

  /** Converts the string to a number; throws an error if the string is not a valid number. */
  public static readonly number = z.string().transform(v => {
    const envValNum = Number(v);
    if (isNaN(envValNum)) {
      throw new Error(`${String(v)} is not parsable to number.`);
    }
    return envValNum;
  });

  /** Requires the value to be present and non-empty. */
  public static readonly string = z.string().nonempty();

  /** Converts the string to a list by splitting it at commas. */
  public static readonly list = z.string().transform(v => {
    const elements = v.split(',');
    if (elements.length === 1 && elements[0] === '') {
      return [];
    }
    return elements;
  });

  private constructor() {}
}

