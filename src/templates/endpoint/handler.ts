import { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { parseAuthorizerContext } from '../../runtime/parser/parse-authorizer-context';
import { parseEnvironment } from '../../runtime/parser/parse-environment';
import { parseRequest } from '../../runtime/parser/parse-request';
import { RawRequest } from '../../runtime/types/raw-request';
import { parseResponse } from '../../runtime/parser/parse-response';
import { zAuthorizerContext } from './authorizer';
import { zEnvironment } from './environment';
import { main } from './main';
import { Request, zRequest } from './request';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../generator/private/generated-doc-data';

export const handler = async (rawRequest: RawRequest): Promise<APIGatewayProxyResult> => {
  const environment = parseEnvironment(zEnvironment);
  const authorizerContext = parseAuthorizerContext(zAuthorizerContext, rawRequest);

  let request: Request;
  try {
    request = parseRequest(zRequest, rawRequest);
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return parseResponse({
        statusCode: 400,
        body: e.issues,
      });
    }
    throw e;
  }

  return main(environment, request, authorizerContext).then(parseResponse);
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'The entrypoint for this endpoints lambda handler. Performs parsing and validation and injects the results into the main function.',
  expectedSignature: ['export const handler = async (rawRequest: RawRequest): Promise<APIGatewayProxyResult>'],
  canBeEdited: Editability.NO_INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};
