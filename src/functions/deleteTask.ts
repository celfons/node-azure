import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

/**
 * Azure Function: Delete Task
 * DELETE /api/tasks/{id}
 */
export async function deleteTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Delete Task function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    const id = request.params.id;

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
      params: { id }
    } as any;
    
    await controller.deleteTask(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Delete Task function:', error);
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

app.http('deleteTask', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'api/tasks/{id}',
  handler: deleteTask
});
