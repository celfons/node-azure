import { ServiceBusClient, ServiceBusMessage, ServiceBusSender } from '@azure/service-bus';
import { Task } from '../../domain/entities/Task';
import { ITaskEventPublisher } from '../../domain/interfaces/ITaskEventPublisher';

/**
 * Azure Service Bus implementation for publishing task events to a queue
 */
export class AzureServiceBusTaskEventPublisher implements ITaskEventPublisher {
  private static readonly TIMESTAMP_FIELD = 'timestamp';
  private client: ServiceBusClient;
  private sender: ServiceBusSender;
  private queueName: string;

  constructor(connectionString: string, queueName: string) {
    this.queueName = queueName;
    this.client = new ServiceBusClient(connectionString);
    this.sender = this.client.createSender(queueName);
  }

  async publishTaskCreated(task: Task): Promise<void> {
    await this.sendMessage('task.created', task);
  }

  async publishTaskUpdated(task: Task): Promise<void> {
    await this.sendMessage('task.updated', task);
  }

  async publishTaskDeleted(taskId: string): Promise<void> {
    await this.sendMessage('task.deleted', { id: taskId });
  }

  private async sendMessage<T extends { id: string }>(eventType: string, payload: T): Promise<void> {
    const message: ServiceBusMessage = {
      body: {
        eventType,
        payload,
        [AzureServiceBusTaskEventPublisher.TIMESTAMP_FIELD]: new Date().toISOString()
      },
      contentType: 'application/json',
      subject: eventType
    };

    try {
      await this.sender.sendMessages(message);
    } catch (error) {
      console.error('[ServiceBus] Failed to publish task event', {
        eventType,
        queueName: this.queueName,
        payloadId: payload.id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.sender.close();
    await this.client.close();
  }
}
