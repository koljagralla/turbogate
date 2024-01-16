import * as lambda from 'aws-cdk-lib/aws-lambda';
import { EndpointConfig } from '../../../runtime/types/configs/endpoint-config';
import { LambdaRequestAuthorizerConfig } from '../../../runtime/types/configs/lambda-request-authorizer-config';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../../generator/util/generated-doc-data';

export const defaultConfig: EndpointConfig & LambdaRequestAuthorizerConfig = {
  lambda: {
    runtime: lambda.Runtime.NODEJS_16_X,
    bundling: {
      minify: true,
      externalModules: ['aws-sdk'],
    },
  },
  integration: {},
  requestAuthorizer: {
    // CDK has this field as required, in Cfn it is not.
    // So we need to set it to an empty array so TS doesn't complain.
    identitySources: [],
  },
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose: 'Declares default values for the AWS CDK construct configs used accross your generated resources.',
  expectedSignature: ['export const defaultConfig: EndpointConfig & LambdaRequestAuthorizerConfig'],
  canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.YES_IF_NOT_NEEDED_BUT_CLEAN_DEPENDENCIES,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED_WITH_BOILERPLATE,
};