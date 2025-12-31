import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

/**
 * Update Task Use Case
 * Single Responsibility: Handle task update logic
 */
export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, title: string, description: string, completed: boolean): Promise<Task | null> {
    const existingTask = await this.taskRepository.findById(id);
    
    if (!existingTask) {
      return null;
    }

    existingTask.update(title, description);
    if (completed && !existingTask.completed) {
      existingTask.complete();
    }

    return await this.taskRepository.update(id, existingTask);
  }
}
