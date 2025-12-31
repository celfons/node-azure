import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

/**
 * Delete Task Use Case
 * Single Responsibility: Handle task deletion
 */
export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.taskRepository.delete(id);
  }
}
