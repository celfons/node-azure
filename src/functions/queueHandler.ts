import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { SimpleInfrastructure } from '../simpleInfrastructure';
import { TaskRequestMapper } from '../infrastructure/mappers/TaskRequestMapper';

/**
 * Azure Function: Task Queue Handler
 * POST /api/tasks - Send task creation request to queue
 */
export async function sendTaskToQueue(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Send Task to Queue function triggered');

  try {
    // Parse request body
    const body = await request.json() as any;

    // Validate required fields
    if (!body || !body.title) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: 'Missing required field: title'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    // Convert HTTP request to queue message (decoupling adapters)
    const message = TaskRequestMapper.toMessage(body);

    // Send message to queue
    const queuePublisher = SimpleInfrastructure.getQueuePublisher();
    await queuePublisher.send(message);

    context.log('Task request sent to queue successfully', { requestId: message.requestId });

    return {
      status: 202,
      jsonBody: {
        success: true,
        message: 'Task request sent to queue for processing',
        requestId: message.requestId
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error sending task to queue:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: 'Failed to send task to queue',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
}

/**
 * Azure Function: Health Check
 * GET /api/health
 */
export async function healthCheck(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Health Check function triggered');

  try {
    return {
      status: 200,
      jsonBody: {
        success: true,
        status: 'healthy',
        message: 'Queue service is operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    context.error('Error in Health Check function:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        status: 'unhealthy',
        message: 'Service error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
}

// Register POST endpoint for sending tasks to queue
app.http('sendTaskToQueue', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'tasks',
  handler: sendTaskToQueue
});

// Register GET endpoint for health check
app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: healthCheck
});
