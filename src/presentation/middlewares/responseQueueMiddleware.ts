import { Request, Response, NextFunction } from 'express';
import { IQueuePublisher } from '../../domain/interfaces/IQueuePublisher';

/**
 * Middleware to publish HTTP responses to Azure Service Bus queue
 */
export const createResponseQueueMiddleware = (publisher: IQueuePublisher) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let responseBody: unknown;

    const originalJson = res.json.bind(res);
    res.json = (body?: any): Response => {
      responseBody = body;
      return originalJson(body);
    };

    const originalSend = res.send.bind(res);
    res.send = (body?: any): Response => {
      responseBody = body;
      return originalSend(body);
    };

    res.on('finish', () => {
      publisher
        .send({
          eventType: 'http.response',
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          response: responseBody
        })
        .catch((error) => {
          console.error('[ResponseQueue] Failed to publish response', {
            path: req.originalUrl,
            error: error instanceof Error ? error.message : String(error)
          });
        });
    });

    next();
  };
};
