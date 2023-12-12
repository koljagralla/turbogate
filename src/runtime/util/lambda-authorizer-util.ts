import { LambdaAuthorizerResponse } from '../types/missing-aws-types/lambda-authorizer-response';

export class LambdaAuthorizerUtil {
  private constructor() {}

  /** @deprecated Suffers from {@link https://stackoverflow.com/a/56119016 this problem}. Don't use until fixed. */
  public static grantAccess<C extends object>(resourceArn: string, context: C): LambdaAuthorizerResponse<C, 'Allow'> {
    return {
      principalId: 'me', // TODO change
      context,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: resourceArn,
          },
        ],
      },
    };
  }

  /** @deprecated Suffers from {@link https://stackoverflow.com/a/56119016 this problem}. Don't use until fixed. */
  public static denyAccess(resourceArn: string): LambdaAuthorizerResponse<never, 'Deny'> {
    return {
      principalId: 'me', // TODO change
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: resourceArn,
          },
        ],
      },
    };
  }
}
