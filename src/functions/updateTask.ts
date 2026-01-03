import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Update Task
 * PUT /api/tasks/{id}
 */
export async function updateTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Update Task function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    const id = request.params.id;
    const body = await request.json() as any;

    if (!id) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: 'Task ID is required'
        }
      };
    }
    
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
      params: { id },
      body: body
    } as any;
    
    await controller.updateTask(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Update Task function:', error);
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

app.http('updateTask', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'api/tasks/{id}',
  handler: updateTask
});
