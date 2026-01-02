import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import { IQueuePublisher } from '../../domain/interfaces/IQueuePublisher';

/**
 * Azure Service Bus generic queue publisher
 */
export class AzureServiceBusQueuePublisher implements IQueuePublisher {
  private client: ServiceBusClient;
  private sender: ServiceBusSender;

  constructor(connectionString: string, queueName: string) {
    this.client = new ServiceBusClient(connectionString);
    this.sender = this.client.createSender(queueName);
  }

  async send(message: unknown): Promise<void> {
    await this.sender.sendMessages({
      body: {
        ...((typeof message === 'object' && message !== null) ? message : { value: message }),
        timestamp: new Date().toISOString()
      },
      contentType: 'application/json',
      subject: 'http.response'
    });
  }

  async close(): Promise<void> {
    await this.sender.close();
    await this.client.close();
  }
}
