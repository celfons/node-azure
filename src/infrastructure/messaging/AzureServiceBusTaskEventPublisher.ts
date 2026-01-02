import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { Task } from '../../domain/entities/Task';
import { ITaskEventPublisher } from '../../domain/interfaces/ITaskEventPublisher';

/**
 * Azure Service Bus implementation for publishing task events to a queue
 */
export class AzureServiceBusTaskEventPublisher implements ITaskEventPublisher {
  private client: ServiceBusClient;
  private queueName: string;

  constructor(connectionString: string, queueName: string) {
    this.client = new ServiceBusClient(connectionString);
    this.queueName = queueName;
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

  private async sendMessage(eventType: string, payload: Task | { id: string }): Promise<void> {
    const sender = this.client.createSender(this.queueName);
    const message: ServiceBusMessage = {
      body: {
        eventType,
        payload,
        timestamp: new Date().toISOString()
      },
      contentType: 'application/json',
      subject: eventType
    };

    try {
      await sender.sendMessages(message);
    } catch (error) {
      console.error('Failed to publish task event to Azure Service Bus', error);
    } finally {
      await sender.close();
    }
  }
}
