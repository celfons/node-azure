import { Task } from '../entities/Task';

/**
 * Repository Interface - Following Repository Pattern and Dependency Inversion Principle
 * Defines the contract for data access operations
 */
export interface ITaskRepository {
  /**
   * Find all tasks
   */
  findAll(): Promise<Task[]>;

  /**
   * Find a task by ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Create a new task
   */
  create(task: Task): Promise<Task>;

  /**
   * Update an existing task
   */
  update(id: string, task: Task): Promise<Task | null>;

  /**
   * Delete a task
   */
  delete(id: string): Promise<boolean>;
}
