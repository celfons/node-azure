import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import {
  MongoClientSingleton,
  taskToDocument,
  documentToTask,
} from '../database/mongoClient';

/**
 * MongoDB Task Repository Implementation
 * Implements ITaskRepository interface following Dependency Inversion Principle
 * Persists tasks in MongoDB using the official Node.js driver
 */
export class MongoTaskRepository implements ITaskRepository {
  private mongoClient: MongoClientSingleton;

  constructor() {
    this.mongoClient = MongoClientSingleton.getInstance();
  }

  /**
   * Ensure MongoDB connection before operations
   */
  private async ensureConnection(): Promise<void> {
    if (!this.mongoClient.isConnected()) {
      await this.mongoClient.connect();
    }
  }

  /**
   * Find all tasks
   */
  async findAll(): Promise<Task[]> {
    await this.ensureConnection();
    const collection = this.mongoClient.getTasksCollection();
    const documents = await collection.find({}).toArray();
    return documents.map(documentToTask);
  }

  /**
   * Find a task by ID
   */
  async findById(id: string): Promise<Task | null> {
    await this.ensureConnection();
    const collection = this.mongoClient.getTasksCollection();
    const document = await collection.findOne({ id });
    return document ? documentToTask(document) : null;
  }

  /**
   * Create a new task
   */
  async create(task: Task): Promise<Task> {
    await this.ensureConnection();
    const collection = this.mongoClient.getTasksCollection();
    const document = taskToDocument(task);
    await collection.insertOne(document);
    return task;
  }

  /**
   * Update an existing task
   */
  async update(id: string, task: Task): Promise<Task | null> {
    await this.ensureConnection();
    const collection = this.mongoClient.getTasksCollection();
    
    // Check if task exists
    const existing = await collection.findOne({ id });
    if (!existing) {
      return null;
    }

    // Update the task
    const document = taskToDocument(task);
    await collection.updateOne(
      { id },
      { $set: document }
    );

    return task;
  }

  /**
   * Delete a task
   */
  async delete(id: string): Promise<boolean> {
    await this.ensureConnection();
    const collection = this.mongoClient.getTasksCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
