import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Create Task
 * POST /api/tasks
 */
export async function createTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Create Task function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    const body = await request.json() as any;
    
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

    const mockReq = {
      body: body
    } as any;
    
    await controller.createTask(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Create Task function:', error);
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

app.http('createTask', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'api/tasks',
  handler: createTask
});
