import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Health Check
 * GET /api/hello/health
 */
export async function healthCheck(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Health Check function triggered');

  try {
    const controller = Infrastructure.getHelloController();
    
    let responseData: any = null;
    let statusCode = 200;

    const mockRes = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
      }
    };

    const mockReq = {} as any;
    controller.health(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
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
