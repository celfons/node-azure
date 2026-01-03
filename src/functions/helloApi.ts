import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Hello API
 * GET /api/hello
 */
export async function helloApi(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Hello API function triggered');

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
    controller.hello(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
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
