import { LambdaAuthorizerContext } from './lambda-authorizer-context';

/**
 * Lambda Authorizer Response (not provided by CDK/AWS SDK) as defined
 * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html here by AWS}.
 */
export type LambdaAuthorizerResponse<
  ProvidedContext extends LambdaAuthorizerContext,
  Effect extends 'Allow' | 'Deny',
> = Effect extends 'Allow'
  ? {
      principalId: string;
      policyDocument: {
        Version: '2012-10-17';
        Statement: [
          {
            Action: 'execute-api:Invoke';
            Effect: 'Allow';
            Resource: string;
          },
        ];
      };
      context: ProvidedContext;
    }
  : {
      principalId: string;
      policyDocument: {
        Version: '2012-10-17';
        Statement: [
          {
            Action: 'execute-api:Invoke';
            Effect: 'Deny';
            Resource: string;
          },
        ];
      };
    };
