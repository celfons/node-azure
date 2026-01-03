import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Hello World
 * GET /
 */
export async function helloWorld(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Hello World function triggered');

  try {
    const controller = Infrastructure.getHelloController();
    
    // Create a mock Express-like response object
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
