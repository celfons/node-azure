import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';
import { createMockRequest, createMockResponse } from './utils';

/**
 * Azure Function: Get Task By ID
 * GET /api/tasks/{id}
 */
export async function getTaskById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Get Task By ID function triggered');

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
    
    await controller.getTaskById(mockReq, res);

    return {
      status: getStatus(),
      jsonBody: getData(),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Get Task By ID function:', error);
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

app.http('getTaskById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'api/tasks/{id}',
  handler: getTaskById
});
