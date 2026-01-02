import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { ITaskEventPublisher } from '../../domain/interfaces/ITaskEventPublisher';
import { CreateTaskUseCase } from '../use-cases/CreateTaskUseCase';
import { GetAllTasksUseCase } from '../use-cases/GetAllTasksUseCase';
import { GetTaskByIdUseCase } from '../use-cases/GetTaskByIdUseCase';
import { UpdateTaskUseCase } from '../use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../use-cases/DeleteTaskUseCase';

/**
 * Task Service
 * Orchestrates use cases and provides a unified interface
 * Follows Facade pattern and Single Responsibility Principle
 */
export class TaskService {
  private createTaskUseCase: CreateTaskUseCase;
  private getAllTasksUseCase: GetAllTasksUseCase;
  private getTaskByIdUseCase: GetTaskByIdUseCase;
  private updateTaskUseCase: UpdateTaskUseCase;
  private deleteTaskUseCase: DeleteTaskUseCase;
  private taskEventPublisher: ITaskEventPublisher;

  constructor(taskRepository: ITaskRepository, taskEventPublisher: ITaskEventPublisher) {
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
    this.getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
    this.taskEventPublisher = taskEventPublisher;
  }

  async createTask(title: string, description: string): Promise<Task> {
    const task = await this.createTaskUseCase.execute(title, description);
    await this.publishSafely(() => this.taskEventPublisher.publishTaskCreated(task));
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.getAllTasksUseCase.execute();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.getTaskByIdUseCase.execute(id);
  }

  async updateTask(id: string, title: string, description: string, completed: boolean): Promise<Task | null> {
    const task = await this.updateTaskUseCase.execute(id, title, description, completed);
    if (task) {
      await this.publishSafely(() => this.taskEventPublisher.publishTaskUpdated(task));
    }
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const deleted = await this.deleteTaskUseCase.execute(id);
    if (deleted) {
      await this.publishSafely(() => this.taskEventPublisher.publishTaskDeleted(id));
    }
    return deleted;
  }

  private async publishSafely(publishFn: () => Promise<void>): Promise<void> {
    try {
      await publishFn();
    } catch (error) {
      console.error('[TaskService] Task event publication failed', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}
