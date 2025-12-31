import dotenv from 'dotenv';
import { App } from './config/app';

// Load environment variables
dotenv.config();

/**
 * Main Entry Point
 * Bootstraps the application
 */
const PORT = parseInt(process.env.PORT || '8080', 10);

const app = new App(PORT);
app.listen();
