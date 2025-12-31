import { MongoClient, Db, Collection } from 'mongodb';
import { Task } from '../../domain/entities/Task';

/**
 * MongoDB Client Singleton
 * Manages Azure Cosmos DB (MongoDB API) connection and provides access to database/collections
 * Following Singleton pattern for connection reuse
 */
export class MongoClientSingleton {
  private static instance: MongoClientSingleton;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private readonly uri: string;
  private readonly dbName: string;
  private readonly collectionName: string;

  private constructor() {
    // Validate AZURE_COSMOS_CONNECTIONSTRING is present
    this.uri = process.env.AZURE_COSMOS_CONNECTIONSTRING || '';
    if (!this.uri) {
      throw new Error('AZURE_COSMOS_CONNECTIONSTRING environment variable is required when using Azure Cosmos DB');
    }

    // Optional configuration with defaults
    this.dbName = process.env.MONGODB_DATABASE || 'tasks_db';
    this.collectionName = process.env.MONGODB_COLLECTION || 'tasks';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MongoClientSingleton {
    if (!MongoClientSingleton.instance) {
      MongoClientSingleton.instance = new MongoClientSingleton();
    }
    return MongoClientSingleton.instance;
  }

  /**
   * Connect to Azure Cosmos DB (idempotent - reuses existing connection)
   */
  public async connect(): Promise<void> {
    if (this.client && this.db) {
      // Already connected
      return;
    }

    try {
      console.log('🔌 Connecting to Azure Cosmos DB...');
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`✅ Connected to Azure Cosmos DB database: ${this.dbName}`);
      
      // Ensure indexes for efficient lookups
      await this.ensureIndexes();
    } catch (error) {
      console.error('❌ Failed to connect to Azure Cosmos DB:', error);
      throw error;
    }
  }

  /**
   * Create indexes for efficient queries
   */
  private async ensureIndexes(): Promise<void> {
    try {
      const collection = this.getTasksCollection();
      // Create unique index on id field for efficient lookups
      await collection.createIndex({ id: 1 }, { unique: true });
      console.log('✅ Azure Cosmos DB indexes created');
    } catch (error) {
      console.warn('⚠️  Could not create indexes:', error);
    }
  }

  /**
   * Get tasks collection
   */
  public getTasksCollection(): Collection<TaskDocument> {
    if (!this.db) {
      throw new Error('Azure Cosmos DB not connected. Call connect() first.');
    }
    return this.db.collection<TaskDocument>(this.collectionName);
  }

  /**
   * Close Azure Cosmos DB connection
   */
  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('🔌 Azure Cosmos DB connection closed');
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }
}

/**
 * MongoDB Task Document Interface
 * Maps domain Task entity to MongoDB document structure
 */
export interface TaskDocument {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper function to convert Task entity to MongoDB document
 */
export function taskToDocument(task: Task): TaskDocument {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

/**
 * Helper function to convert MongoDB document to Task entity
 */
export function documentToTask(doc: TaskDocument): Task {
  return new Task(
    doc.id,
    doc.title,
    doc.description,
    doc.completed,
    doc.createdAt,
    doc.updatedAt
  );
}
