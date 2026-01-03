import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

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
    
    const { res, getStatus, getData } = createMockResponse();
    const mockReq = createMockRequest({ id });
    
    await controller.deleteTask(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
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
