import express, { Application } from 'express';
import cors from 'cors';
import { InMemoryTaskRepository } from '../infrastructure/repositories/InMemoryTaskRepository';
import { MongoTaskRepository } from '../infrastructure/repositories/MongoTaskRepository';
import { ITaskRepository } from '../domain/interfaces/ITaskRepository';
import { ITaskEventPublisher } from '../domain/interfaces/ITaskEventPublisher';
import { AzureServiceBusTaskEventPublisher } from '../infrastructure/messaging/AzureServiceBusTaskEventPublisher';
import { NoopTaskEventPublisher } from '../infrastructure/messaging/NoopTaskEventPublisher';
import { TaskService } from '../application/services/TaskService';
import { TaskController } from '../presentation/controllers/TaskController';
import { HelloController } from '../presentation/controllers/HelloController';
import { TaskRoutes } from '../presentation/routes/taskRoutes';
import { HelloRoutes } from '../presentation/routes/helloRoutes';
import { errorHandler } from '../presentation/middlewares/errorHandler';
import { requestLogger } from '../presentation/middlewares/requestLogger';

/**
 * App Configuration
 * Sets up Express application with dependency injection
 * Following Dependency Inversion and Single Responsibility principles
 */
export class App {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS
    this.app.use(cors());

    // Request logger
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Dependency Injection - Manual DI Container
    // Use Azure Cosmos DB repository if AZURE_COSMOS_CONNECTIONSTRING is configured, otherwise use in-memory
    const taskRepository: ITaskRepository = this.createTaskRepository();
    const taskEventPublisher: ITaskEventPublisher = this.createTaskEventPublisher();
    const taskService = new TaskService(taskRepository, taskEventPublisher);
    const taskController = new TaskController(taskService);
    const helloController = new HelloController();

    // Initialize routes
    const taskRoutes = new TaskRoutes(taskController);
    const helloRoutes = new HelloRoutes(helloController);

    // Mount routes
    this.app.use('/api/hello', helloRoutes.getRouter());
    this.app.use('/api/tasks', taskRoutes.getRouter());
    this.app.use('/', helloRoutes.getRouter()); // Root path for hello world
  }

  /**
   * Create task repository based on environment configuration
   * Uses MongoDB/Cosmos if AZURE_COSMOS_CONNECTIONSTRING is set, otherwise falls back to in-memory storage
   */
  private createTaskRepository(): ITaskRepository {
    const cosmosConnectionString = process.env.AZURE_COSMOS_CONNECTIONSTRING;
    
    if (cosmosConnectionString && cosmosConnectionString.trim() !== '') {
      console.log('💾 Using Azure Cosmos DB (MongoDB API) for task storage');
      return new MongoTaskRepository();
    } else {
      console.log('💾 Using in-memory storage for tasks');
      return new InMemoryTaskRepository();
    }
  }

  /**
   * Create task event publisher based on Azure Service Bus configuration
   * Uses queue when AZURE_SERVICEBUS_CONNECTIONSTRING and AZURE_SERVICEBUS_QUEUE_NAME are set
   */
  private createTaskEventPublisher(): ITaskEventPublisher {
    const connectionString = process.env.AZURE_SERVICEBUS_CONNECTIONSTRING;
    const queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    if (connectionString && connectionString.trim() !== '' && queueName && queueName.trim() !== '') {
      console.log('📨 Using Azure Service Bus Queue for task events');
      return new AzureServiceBusTaskEventPublisher(connectionString, queueName);
    }

    console.log('📨 Task event publishing disabled (Azure Service Bus not configured)');
    return new NoopTaskEventPublisher();
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Hello World: http://localhost:${this.port}/`);
      console.log(`🔗 API Health: http://localhost:${this.port}/api/hello/health`);
      console.log(`🔗 Tasks API: http://localhost:${this.port}/api/tasks`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
