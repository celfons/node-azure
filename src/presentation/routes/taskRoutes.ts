import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

/**
 * Task Routes
 * Defines routes for task CRUD operations
 */
export class TaskRoutes {
  private router: Router;
  private taskController: TaskController;

  constructor(taskController: TaskController) {
    this.router = Router();
    this.taskController = taskController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET all tasks
    this.router.get('/', (req, res) => this.taskController.getAllTasks(req, res));

    // GET task by ID
    this.router.get('/:id', (req, res) => this.taskController.getTaskById(req, res));

    // POST create new task
    this.router.post('/', (req, res) => this.taskController.createTask(req, res));

    // PUT update task
    this.router.put('/:id', (req, res) => this.taskController.updateTask(req, res));

    // DELETE task
    this.router.delete('/:id', (req, res) => this.taskController.deleteTask(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
