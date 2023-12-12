import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ReducedNodejsFunctionProps } from '../reduced-props/reduced-node-js-function-props';

export type EndpointConfig = {
  lambda: ReducedNodejsFunctionProps;
  integration: apigateway.LambdaIntegrationOptions;
};
