import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

/**
 * Get Task By ID Use Case
 * Single Responsibility: Retrieve a specific task
 */
export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }
}
