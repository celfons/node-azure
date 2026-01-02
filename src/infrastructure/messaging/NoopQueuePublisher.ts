import { IQueuePublisher } from '../../domain/interfaces/IQueuePublisher';

/**
 * No-op queue publisher used when Service Bus is not configured
 */
export class NoopQueuePublisher implements IQueuePublisher {
  async send(_message: unknown): Promise<void> {}

  async close(): Promise<void> {}
}
