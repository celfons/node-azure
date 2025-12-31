import { Router } from 'express';
import { HelloController } from '../controllers/HelloController';

/**
 * Hello Routes
 * Defines routes for hello world and health check
 */
export class HelloRoutes {
  private router: Router;
  private helloController: HelloController;

  constructor(helloController: HelloController) {
    this.router = Router();
    this.helloController = helloController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET hello world
    this.router.get('/', (req, res) => this.helloController.hello(req, res));

    // GET health check
    this.router.get('/health', (req, res) => this.helloController.health(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
