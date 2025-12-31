import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
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

  constructor(taskRepository: ITaskRepository) {
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
    this.getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  }

  async createTask(title: string, description: string): Promise<Task> {
    return await this.createTaskUseCase.execute(title, description);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.getAllTasksUseCase.execute();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.getTaskByIdUseCase.execute(id);
  }

  async updateTask(id: string, title: string, description: string, completed: boolean): Promise<Task | null> {
    return await this.updateTaskUseCase.execute(id, title, description, completed);
  }

  async deleteTask(id: string): Promise<boolean> {
    return await this.deleteTaskUseCase.execute(id);
  }
}
