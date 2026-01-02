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

    const wasCompleted = existingTask.completed;
    existingTask.update(title, description);

    if (completed && !wasCompleted) {
      existingTask.complete();
    } else if (!completed && wasCompleted) {
      existingTask.uncomplete();
    }

    return await this.taskRepository.update(id, existingTask);
  }
}
