import { ReducedNodejsFunctionProps } from '../reduced-props/reduced-node-js-function-props';
import { ReducedRequestAuthorizerProps } from '../reduced-props/reduced-request-authorizer-props';

export type LambdaRequestAuthorizerConfig = {
  lambda: ReducedNodejsFunctionProps;
  requestAuthorizer: ReducedRequestAuthorizerProps;
};
