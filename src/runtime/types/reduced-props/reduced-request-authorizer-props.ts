import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export type ReducedRequestAuthorizerProps = Omit<apigateway.RequestAuthorizerProps, 'authorizerName' | 'handler'>;
