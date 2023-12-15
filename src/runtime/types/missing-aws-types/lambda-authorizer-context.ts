/**
 * The context provided by a lambda authorizer can only contain strings, numbers, and booleans.
 * But those values get stringified when passed to the main lambda.
 * Therefor we declare this type as a Record<string, string> to only allow for strings so we can use this type
 * also for ingress contexts.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
export type LambdaAuthorizerContext = Record<string, string>;
