import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

/**
 * Create Task Use Case
 * Single Responsibility: Handle task creation logic
 */
export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(title: string, description: string): Promise<Task> {
    const task = Task.create(title, description);
    return await this.taskRepository.create(task);
  }
}
