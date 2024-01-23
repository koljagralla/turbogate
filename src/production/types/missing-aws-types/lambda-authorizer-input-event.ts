/**
 * Lambda Authorizer Input Event (not provided by CDK/AWS SDK) as defined
 * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html here by AWS}.
 */
export type LambdaAuthorizerInputEvent = {
  type: string;
  methodArn: string;
  resource: string;
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  pathParameters: Record<string, string>;
  stageVariables: Record<string, string>;
  requestContext: RequestContext;
};

type Validity = {
  notBefore: string;
  notAfter: string;
};

type ClientCert = {
  clientCertPem: string;
  subjectDN: string;
  issuerDN: string;
  serialNumber: string;
  validity: Validity;
};

type Identity = {
  apiKey: string;
  sourceIp: string;
  clientCert: ClientCert;
};

type RequestContext = {
  path: string;
  accountId: string;
  resourceId: string;
  stage: string;
  requestId: string;
  identity: Identity;
  resourcePath: string;
  httpMethod: string;
  apiId: string;
};
