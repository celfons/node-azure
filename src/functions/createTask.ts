import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Create Task
 * POST /api/tasks
 */
export async function createTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Create Task function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    const body = await request.json();
    
    const { res, getStatus, getData } = createMockResponse();
    const mockReq = createMockRequest(undefined, body);
    
    await controller.createTask(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
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
