import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';

export type ReducedNodejsFunctionProps = Omit<NodejsFunctionProps, 'entry' | 'functionName' | 'environment'>;
