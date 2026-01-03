import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Get All Tasks
 * GET /api/tasks
 */
export async function getAllTasks(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Get All Tasks function triggered');

  try {
    const controller = Infrastructure.getTaskController();
    const { res, getStatus, getData } = createMockResponse();
    const mockReq = createMockRequest();

    await controller.getAllTasks(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
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
