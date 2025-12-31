import { App } from './config/app';

/**
 * Main Entry Point
 * Bootstraps the application
 * Environment variables are loaded from Azure Web App Configuration
 */
const PORT = parseInt(process.env.PORT || '8080', 10);

const app = new App(PORT);
app.listen();
