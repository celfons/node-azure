import { Task } from '../entities/Task';

/**
 * Task Event Publisher Interface
 * Defines contract for publishing task lifecycle events
 */
export interface ITaskEventPublisher {
  /**
   * Publish event when a task is created
   */
  publishTaskCreated(task: Task): Promise<void>;

  /**
   * Publish event when a task is updated
   */
  publishTaskUpdated(task: Task): Promise<void>;

  /**
   * Publish event when a task is deleted
   */
  publishTaskDeleted(taskId: string): Promise<void>;
}
