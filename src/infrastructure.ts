import { InMemoryTaskRepository } from './infrastructure/repositories/InMemoryTaskRepository';
import { MongoTaskRepository } from './infrastructure/repositories/MongoTaskRepository';
import { ITaskRepository } from './domain/interfaces/ITaskRepository';
import { ITaskEventPublisher } from './domain/interfaces/ITaskEventPublisher';
import { IQueuePublisher } from './domain/interfaces/IQueuePublisher';
import { AzureServiceBusTaskEventPublisher } from './infrastructure/messaging/AzureServiceBusTaskEventPublisher';
import { NoopTaskEventPublisher } from './infrastructure/messaging/NoopTaskEventPublisher';
import { AzureServiceBusQueuePublisher } from './infrastructure/messaging/AzureServiceBusQueuePublisher';
import { NoopQueuePublisher } from './infrastructure/messaging/NoopQueuePublisher';
import { TaskService } from './application/services/TaskService';
import { TaskController } from './presentation/controllers/TaskController';
import { HelloController } from './presentation/controllers/HelloController';

/**
 * Shared Infrastructure
 * Initializes and provides access to controllers and services
 * Used by Azure Functions to maintain consistent dependency injection
 */
class Infrastructure {
  private static _taskController: TaskController | null = null;
  private static _helloController: HelloController | null = null;
  private static _taskEventPublisher: ITaskEventPublisher | null = null;
  private static _queuePublisher: IQueuePublisher | null = null;
  private static initialized = false;

  /**
   * Initialize infrastructure components
   */
  static initialize(): void {
    if (this.initialized) {
      return;
    }

    const taskRepository = this.createTaskRepository();
    this._taskEventPublisher = this.createTaskEventPublisher();
    this._queuePublisher = this.createQueuePublisher();
    
    const taskService = new TaskService(taskRepository, this._taskEventPublisher);
    this._taskController = new TaskController(taskService);
    this._helloController = new HelloController();

    this.registerGracefulShutdown();
    this.initialized = true;

    console.log('✅ Infrastructure initialized for Azure Functions');
  }

  /**
   * Get Task Controller instance
   */
  static getTaskController(): TaskController {
    if (!this._taskController) {
      this.initialize();
    }
    return this._taskController!;
  }

  /**
   * Get Hello Controller instance
   */
  static getHelloController(): HelloController {
    if (!this._helloController) {
      this.initialize();
    }
    return this._helloController!;
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
   * Create task repository based on environment configuration
   */
  private static createTaskRepository(): ITaskRepository {
    const cosmosConnectionString = process.env.AZURE_COSMOS_CONNECTIONSTRING;
    
    if (this.hasValue(cosmosConnectionString)) {
      console.log('💾 Using Azure Cosmos DB (MongoDB API) for task storage');
      return new MongoTaskRepository();
    } else {
      console.log('💾 Using in-memory storage for tasks');
      return new InMemoryTaskRepository();
    }
  }

  /**
   * Create task event publisher based on Azure Service Bus configuration
   */
  private static createTaskEventPublisher(): ITaskEventPublisher {
    const connectionString = process.env.AZURE_SERVICEBUS_CONNECTIONSTRING;
    const queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    if (this.hasValue(connectionString) && this.hasValue(queueName)) {
      console.log('📨 Using Azure Service Bus Queue for task events');
      return new AzureServiceBusTaskEventPublisher(connectionString, queueName);
    }

    console.log('📨 Task event publishing disabled (Azure Service Bus not configured)');
    return new NoopTaskEventPublisher();
  }

  /**
   * Create generic queue publisher for responses
   */
  private static createQueuePublisher(): IQueuePublisher {
    const connectionString = process.env.AZURE_SERVICEBUS_CONNECTIONSTRING;
    const queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    if (this.hasValue(connectionString) && this.hasValue(queueName)) {
      console.log('📨 Publishing responses to Azure Service Bus Queue');
      return new AzureServiceBusQueuePublisher(connectionString, queueName);
    }

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
      
      const publishers = [this._taskEventPublisher, this._queuePublisher].filter(
        (p) => p !== null
      );

      await Promise.all(
        publishers.map(async (publisher) => {
          if (publisher) {
            try {
              await publisher.close();
            } catch (error) {
              console.error('[Infrastructure] Failed to close publisher', error);
            }
          }
        })
      );
    };

    process.once('SIGINT', close);
    process.once('SIGTERM', close);
  }
}

export { Infrastructure };
