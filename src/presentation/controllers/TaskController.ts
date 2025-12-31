import { Request, Response } from 'express';
import { TaskService } from '../../application/services/TaskService';

/**
 * Task Controller
 * Handles HTTP requests and responses
 * Single Responsibility: Handle API layer concerns
 */
export class TaskController {
  constructor(private taskService: TaskService) {}

  /**
   * GET /api/tasks - Get all tasks
   */
  async getAllTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tasks',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/tasks/:id - Get task by ID
   */
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve task',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/tasks - Create new task
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
        return;
      }

      const task = await this.taskService.createTask(title, description);
      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * PUT /api/tasks/:id - Update task
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      if (!title || !description || typeof completed !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'Title, description, and completed status are required'
        });
        return;
      }

      const task = await this.taskService.updateTask(id, title, description, completed);

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /api/tasks/:id - Delete task
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.taskService.deleteTask(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
