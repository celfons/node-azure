import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Hello API
 * GET /api/hello
 */
export async function helloApi(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Hello API function triggered');

  try {
    const controller = Infrastructure.getHelloController();
    const { res, getStatus, getData } = createMockResponse();
    const mockReq = createMockRequest();

    controller.hello(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Hello API function:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

app.http('helloApi', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'api/hello',
  handler: helloApi
});
