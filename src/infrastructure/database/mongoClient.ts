import { MongoClient, Db, Collection } from 'mongodb';
import { Task } from '../../domain/entities/Task';

/**
 * MongoDB Client Singleton
 * Manages MongoDB connection and provides access to database/collections
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
    // Validate MONGODB_URI is present
    this.uri = process.env.MONGODB_URI || '';
    if (!this.uri) {
      throw new Error('MONGODB_URI environment variable is required when using MongoDB');
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
   * Connect to MongoDB (idempotent - reuses existing connection)
   */
  public async connect(): Promise<void> {
    if (this.client && this.db) {
      // Already connected
      return;
    }

    try {
      console.log('🔌 Connecting to MongoDB...');
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`✅ Connected to MongoDB database: ${this.dbName}`);
      
      // Ensure indexes for efficient lookups
      await this.ensureIndexes();
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
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
      console.log('✅ MongoDB indexes created');
    } catch (error) {
      console.warn('⚠️  Could not create indexes:', error);
    }
  }

  /**
   * Get tasks collection
   */
  public getTasksCollection(): Collection<TaskDocument> {
    if (!this.db) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return this.db.collection<TaskDocument>(this.collectionName);
  }

  /**
   * Close MongoDB connection
   */
  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('🔌 MongoDB connection closed');
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
