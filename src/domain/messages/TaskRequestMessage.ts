/**
 * Task Request Message
 * Decouples HTTP request from queue message format
 */
export interface TaskRequestMessage {
  /**
   * Task title
   */
  title: string;

  /**
   * Task description (optional)
   */
  description?: string;

  /**
   * Timestamp when the request was received
   */
  requestTimestamp: string;

  /**
   * Request ID for tracing
   */
  requestId: string;
}
