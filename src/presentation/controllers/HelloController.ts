import { Request, Response } from 'express';

/**
 * Hello Controller
 * Handles simple hello world endpoint
 */
export class HelloController {
  /**
   * GET / or /api/hello - Hello World endpoint
   */
  hello(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'Hello World from Node.js 24 LTS with TypeScript!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }

  /**
   * GET /api/health - Health check endpoint
   */
  health(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }
}
