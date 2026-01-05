import { IQueuePublisher } from './domain/interfaces/IQueuePublisher';
import { AzureServiceBusQueuePublisher } from './infrastructure/messaging/AzureServiceBusQueuePublisher';
import { NoopQueuePublisher } from './infrastructure/messaging/NoopQueuePublisher';

/**
 * Simplified Infrastructure for Queue-Only Function
 * Initializes and provides access to queue publisher only
 */
class SimpleInfrastructure {
  private static _queuePublisher: IQueuePublisher | null = null;
  private static initialized = false;

  /**
   * Initialize infrastructure components
   */
  static initialize(): void {
    if (this.initialized) {
      return;
    }

    this._queuePublisher = this.createQueuePublisher();
    this.registerGracefulShutdown();
    this.initialized = true;

    console.log('✅ Queue-only infrastructure initialized');
  }

  /**
   * Get Queue Publisher instance
   */
  static getQueuePublisher(): IQueuePublisher {
    if (!this._queuePublisher) {
      this.initialize();
    }
    return this._queuePublisher!;
  }

  /**
   * Create queue publisher for sending messages
   */
  private static createQueuePublisher(): IQueuePublisher {
    const connectionString = process.env.AZURE_SERVICEBUS_CONNECTIONSTRING;
    const queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    if (this.hasValue(connectionString) && this.hasValue(queueName)) {
      console.log('📨 Using Azure Service Bus Queue for messages');
      return new AzureServiceBusQueuePublisher(connectionString, queueName);
    }

    console.log('⚠️  Queue publishing disabled (Azure Service Bus not configured)');
    return new NoopQueuePublisher();
  }

  private static hasValue(value: string | undefined): value is string {
    return Boolean(value && value.trim() !== '');
  }

  private static registerGracefulShutdown(): void {
    let closed = false;
    const close = async (): Promise<void> => {
      if (closed) {
        return;
      }
      closed = true;
      
      if (this._queuePublisher) {
        try {
          await this._queuePublisher.close();
          console.log('🔌 Queue publisher closed');
        } catch (error) {
          console.error('[SimpleInfrastructure] Failed to close queue publisher', error);
        }
      }
    };

    process.once('SIGINT', close);
    process.once('SIGTERM', close);
  }
}

export { SimpleInfrastructure };
