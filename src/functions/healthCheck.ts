import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Health Check
 * GET /api/hello/health
 */
export async function healthCheck(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Health Check function triggered');

  try {
    const controller = Infrastructure.getHelloController();
    const { res, getStatus, getData } = createMockResponse();
    const mockReq = createMockRequest();

    controller.health(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Health Check function:', error);
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

app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'api/hello/health',
  handler: healthCheck
});
