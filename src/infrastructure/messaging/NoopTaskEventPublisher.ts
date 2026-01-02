import { Task } from '../../domain/entities/Task';
import { ITaskEventPublisher } from '../../domain/interfaces/ITaskEventPublisher';

/**
 * No-Operation implementation for task events
 * Used when Azure Service Bus is not configured
 */
export class NoopTaskEventPublisher implements ITaskEventPublisher {
  async publishTaskCreated(_task: Task): Promise<void> {
    return;
  }

  async publishTaskUpdated(_task: Task): Promise<void> {
    return;
  }

  async publishTaskDeleted(_taskId: string): Promise<void> {
    return;
  }
}
