import { TaskRequestMessage } from '../../domain/messages/TaskRequestMessage';

/**
 * Maps HTTP request body to queue message
 * Decouples HTTP adapter from queue message format
 */
export class TaskRequestMapper {
  /**
   * Convert HTTP request body to TaskRequestMessage
   */
  static toMessage(requestBody: any): TaskRequestMessage {
    return {
      title: requestBody.title,
      description: requestBody.description,
      requestTimestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  /**
   * Generate unique request ID for tracing
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}
