import { LambdaAuthorizerContext } from '../types/missing-aws-types/lambda-authorizer-context';
import { LambdaAuthorizerResponse } from '../types/missing-aws-types/lambda-authorizer-response';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * When authorizers are used for multiple endpoints in combination with cache there is a cavaeat regarding the
 * resources. Basically: if you set the resource field explicitly to a specific resource and grant access, the
 * cache will only contain this specific resource. If you then try to access another resource with the same
 * authorizer while the cache is still valid, the request will be denied.
 *
 * Therefor we use the wildcard resource here. This will cause the cache to contain all resources and the
 * authorizer will work as expected. If you are uncertain if this imposes any security risks, please read Akex
 * DeBries article linked below.
 *
 * @see https://www.alexdebrie.com/posts/lambda-custom-authorizers/#caching-across-multiple-functions
 * @see https://stackoverflow.com/a/56119016
 */
export class LambdaAuthorizerUtil {
  private constructor() {}

  /** _**Read class doc before usage!**_ */
  public static grantAccessResponse<C extends LambdaAuthorizerContext>(
    context: C,
  ): LambdaAuthorizerResponse<C, 'Allow'> {
    return {
      principalId: '*',
      context,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  }

  /** _**Read class doc before usage!**_ */
  public static denyAccessResponse(): LambdaAuthorizerResponse<never, 'Deny'> {
    return {
      principalId: '*',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
}
