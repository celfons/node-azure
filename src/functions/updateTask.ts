import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Update Task
 * PUT /api/tasks/{id}
 */
export async function updateTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Update Task function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    const id = request.params.id;
    const body = await request.json();

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
    const mockReq = createMockRequest({ id }, body);
    
    await controller.updateTask(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
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
