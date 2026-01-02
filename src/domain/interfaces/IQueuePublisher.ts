/**
 * Generic queue publisher contract
 */
export interface IQueuePublisher {
  /**
   * Send a message to the queue
   */
  send(message: unknown): Promise<void>;

  /**
   * Cleanup resources
   */
  close(): Promise<void>;
}
