/**
 * The context provided by a lambda authorizer can only contain strings, numbers, and booleans.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
export type LambdaAuthorizerContext = Record<string, string | boolean | number>;
