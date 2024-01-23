import { APIGatewayProxyResult, Context } from 'aws-lambda';
import {
  Deletability,
  Editability,
  GeneratedCodeDisclaimer,
  RecreationBehavior,
} from '../../local/util/generated-doc-data';
import { parseAuthorizerContext } from '../../production/parser/parse-authorizer-context';
import { parseEnvironment } from '../../production/parser/parse-environment';
import { parseRequest } from '../../production/parser/parse-request';
import { parseResponse } from '../../production/parser/parse-response';
import { RawRequest } from '../../production/types/raw-request';
import { z } from 'zod';
import { zAuthorizerContext } from './authorizer';
import { zEnvironment } from './environment';
import { main } from './main';
import { Request, zRequest } from './request';
import { fauxExtendZodWithOpenApi } from '../../production/openapi/faux-extend-zod-with-open-api';

export const handler = async (rawRequest: RawRequest, context: Context): Promise<APIGatewayProxyResult> => {
  fauxExtendZodWithOpenApi(z);

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

  return main(environment, request, authorizerContext, context).then(parseResponse);
};

export const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
  purpose:
    'The entrypoint for this endpoints lambda handler. Performs parsing and validation and injects the results into the main function.',
  expectedSignature: ['export const handler = async (rawRequest: RawRequest): Promise<APIGatewayProxyResult>'],
  canBeEdited: Editability.NO_INTENDED_IF_SIGNATURE_REMAINS,
  canBePermanentlyDeleted: Deletability.NO_CDK_SYNTH_WILL_FAIL,
  willBeRecreated: RecreationBehavior.ON_TURBOGATE_BUILD_WHEN_DELETED,
};
