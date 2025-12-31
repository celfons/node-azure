import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';

/**
 * In-Memory Task Repository Implementation
 * Implements the ITaskRepository interface following Dependency Inversion Principle
 * For production, this would connect to a real database (SQL, MongoDB, etc.)
 */
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async findById(id: string): Promise<Task | null> {
    const task = this.tasks.get(id);
    return task || null;
  }

  async create(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }

  async update(id: string, task: Task): Promise<Task | null> {
    if (!this.tasks.has(id)) {
      return null;
    }
    this.tasks.set(id, task);
    return task;
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}
