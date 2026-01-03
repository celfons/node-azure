import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Hello World
 * GET /
 */
export async function helloWorld(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Hello World function triggered');

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
    context.error('Error in Hello World function:', error);
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

app.http('helloWorld', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: '',
  handler: helloWorld
});
