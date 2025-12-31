/**
 * Task Entity - Domain Model
 * Represents a task in the system following Domain-Driven Design
 */
export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public completed: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Factory method to create a new task
   */
  static create(title: string, description: string): Task {
    const now = new Date();
    return new Task(
      this.generateId(),
      title,
      description,
      false,
      now,
      now
    );
  }

  /**
   * Mark task as completed
   */
  complete(): void {
    this.completed = true;
    this.updatedAt = new Date();
  }

  /**
   * Update task details
   */
  update(title: string, description: string): void {
    this.title = title;
    this.description = description;
    this.updatedAt = new Date();
  }

  /**
   * Simple ID generator (in production, use UUID)
   */
  private static generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
