import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

/**
 * Get All Tasks Use Case
 * Single Responsibility: Retrieve all tasks
 */
export class GetAllTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }
}
