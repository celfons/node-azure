import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Get All Tasks
 * GET /api/tasks
 */
export async function getAllTasks(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Get All Tasks function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    
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
    await controller.getAllTasks(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Get All Tasks function:', error);
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

app.http('getAllTasks', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'api/tasks',
  handler: getAllTasks
});
