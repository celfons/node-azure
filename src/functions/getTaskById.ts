import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Infrastructure } from '../infrastructure';

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
    
    await controller.getTaskById(mockReq, mockRes as any);

    return {
      status: statusCode,
      jsonBody: responseData,
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
