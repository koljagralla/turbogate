import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

/**
 * A function that takes in a lambda function construct and applies grants to it.
 *
 * @example (lambdaFn: NodejsFunction) => myDynamoDb.grantRead(lambdaFn);
 */
export type PermissionCallback = (lambdaFn: NodejsFunction) => void;
