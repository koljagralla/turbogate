import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';

export type RawRequest = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithLambdaAuthorizer<unknown>;
