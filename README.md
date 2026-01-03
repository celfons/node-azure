# Node.js CRUD Application with TypeScript for Azure

A clean, production-ready REST API built with Node.js 24 LTS and TypeScript, following SOLID principles and Clean Code practices. Supports deployment to both **Azure Functions (Serverless)** and **Azure Web Apps**.

## 🚀 Features

- **Hello World Endpoint**: Simple welcome endpoint at root path
- **Full CRUD API**: Complete task management system
- **TypeScript**: Type-safe development
- **Clean Architecture**: Following SOLID principles and separation of concerns
- **Azure Functions**: Serverless deployment option with pay-per-execution pricing
- **Azure Web App**: Traditional web server deployment option
- **Azure Service Bus (Queue)**: Optional publishing of task lifecycle events to a queue
- **Flexible Storage**: In-memory storage (default) or Azure Cosmos DB persistence (configurable)

## 📦 Deployment Options

This application supports two deployment models:

1. **Azure Functions (Serverless)** - Recommended for event-driven workloads
   - See [AZURE_FUNCTIONS_DEPLOYMENT.md](./AZURE_FUNCTIONS_DEPLOYMENT.md) for detailed instructions
   
2. **Azure Web App (Traditional)** - Best for consistent traffic patterns
   - See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for detailed instructions

## 📋 Architecture

This application follows Clean Architecture principles with clear separation of concerns:

```
src/
├── functions/           # Azure Function handlers (serverless)
├── domain/              # Business logic and entities
│   ├── entities/        # Domain models
│   └── interfaces/      # Contracts and abstractions
├── application/         # Use cases and business rules
│   ├── services/        # Application services
│   └── use-cases/       # Individual use case implementations
├── infrastructure/      # External concerns (database, etc.)
│   └── repositories/    # Data access implementations
├── presentation/        # API layer
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   └── middlewares/     # Express middlewares
├── config/              # Application configuration
├── infrastructure.ts    # Shared DI for Azure Functions
└── index.ts            # Entry point (Web App mode)
```

## 🛠️ Technologies

- **Node.js 24 LTS**: Latest long-term support version
- **TypeScript 5.x**: Type-safe JavaScript
- **Azure Functions**: Serverless computing platform
- **Express.js**: Web framework (for Web App mode)
- **MongoDB Driver 7.0.0**: Official MongoDB Node.js driver, compatible with Azure Cosmos DB MongoDB API version 4.0+ (wire protocol version 7+)
- **SOLID Principles**: 
  - Single Responsibility Principle
  - Open/Closed Principle
  - Liskov Substitution Principle
  - Interface Segregation Principle
  - Dependency Inversion Principle

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd node-azure

# Install dependencies
npm install
```

**Note**: This application supports both Azure Functions and Azure Web App deployment models. For local development:
- **Azure Functions mode**: See [AZURE_FUNCTIONS_DEPLOYMENT.md](./AZURE_FUNCTIONS_DEPLOYMENT.md)
- **Web App mode**: Use the instructions below

Environment variables can be configured via `.env` file for local development, `local.settings.json` for Azure Functions local development, or Azure Configuration for production deployments.

## 🗄️ Database Configuration

The application supports two storage backends:

### In-Memory Storage (Default)
By default, the application uses in-memory storage. No additional configuration is needed. Tasks are stored in memory and will be lost when the application restarts.

### Azure Cosmos DB with MongoDB API (Optional)
To use Azure Cosmos DB for persistent storage, configure the `AZURE_COSMOS_CONNECTIONSTRING` environment variable in Azure Web App Configuration.

#### Compatibility Requirements

This application uses MongoDB Node.js driver **version 7.0.0**, which is compatible with:
- **Azure Cosmos DB for MongoDB API version 4.0** (wire protocol version 7)
- MongoDB server versions 3.6 and higher

**Important**: If you encounter wire version errors, ensure your Cosmos DB account uses MongoDB API version 4.0 or higher. Check this in Azure Portal → Cosmos DB Account → Features → MongoDB server version.

#### Azure Configuration

To enable persistent storage in Azure:

1. **Create Azure Cosmos DB account** with MongoDB API (version 4.0 or higher recommended)
2. **Get connection string**:
   - Navigate to Azure Portal → Your Cosmos DB Account → Connection Strings
   - Copy the primary or secondary connection string
3. **Configure in Azure Web App**:
   - Go to your Azure Web App
   - Navigate to **Configuration** → **Application Settings**
   - Add new application setting:
     - Name: `AZURE_COSMOS_CONNECTIONSTRING`
     - Value: Your Cosmos DB connection string
   - Save and restart the application

The application will automatically detect the connection string and use Azure Cosmos DB for storage.

**Important**: Environment variables should be configured in Azure Web App Configuration, not in `.env` files. The `.env.example` file is provided only as a reference for local development.

### Azure Service Bus Queue (Optional)
Publish task lifecycle events to an Azure Service Bus queue by configuring:

- `AZURE_SERVICEBUS_CONNECTIONSTRING`
- `AZURE_SERVICEBUS_QUEUE_NAME`

If these settings are not provided, event publishing is disabled and the app continues to work normally.

## 🏃‍♂️ Running the Application

### Azure Functions Mode (Recommended)

```bash
# Build the application
npm run build

# Start Azure Functions runtime
npm run start:func
# Or: func start
```

Access at `http://localhost:7071/`

**For detailed instructions**, see [AZURE_FUNCTIONS_DEPLOYMENT.md](./AZURE_FUNCTIONS_DEPLOYMENT.md)

### Web App Mode (Traditional)

```bash
# Development mode with hot reload
npm run dev

# Production build and start
npm run build
npm start
```

Access at `http://localhost:8080/`

**For detailed instructions**, see [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)

## 🔗 API Endpoints

### Hello World
- `GET /` - Hello World message
- `GET /api/hello` - Hello World message
- `GET /api/hello/health` - Health check endpoint

### Tasks CRUD
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 📝 API Examples

### Hello World
```bash
curl http://localhost:8080/
```

Response:
```json
{
  "success": true,
  "message": "Hello World from Node.js 24 LTS with TypeScript!",
  "timestamp": "2024-12-31T15:00:00.000Z",
  "environment": "development"
}
```

### Create Task
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "task_1234567890_abc123",
    "title": "My First Task",
    "description": "This is a test task",
    "completed": false,
    "createdAt": "2024-12-31T15:00:00.000Z",
    "updatedAt": "2024-12-31T15:00:00.000Z"
  }
}
```

### Get All Tasks
```bash
curl http://localhost:8080/api/tasks
```

### Update Task
```bash
curl -X PUT http://localhost:8080/api/tasks/task_1234567890_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:8080/api/tasks/task_1234567890_abc123
```

## ☁️ Azure Deployment

This application supports two deployment options:

### Option 1: Azure Functions (Serverless) ⚡

**Recommended for**: Event-driven workloads, variable traffic, pay-per-execution pricing

See comprehensive guide: [AZURE_FUNCTIONS_DEPLOYMENT.md](./AZURE_FUNCTIONS_DEPLOYMENT.md)

**Quick Start**:
```bash
# Build and deploy
npm run build
func azure functionapp publish <your-function-app-name>
```

### Option 2: Azure Web App (Traditional) 🌐

**Recommended for**: Consistent traffic patterns, traditional hosting

See comprehensive guide: [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)

**Quick Start**:
1. Create Azure Web App in Azure Portal
2. Connect GitHub repository via Deployment Center
3. Azure automatically builds and deploys

### Common Configuration

Both deployment options require the same environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_COSMOS_CONNECTIONSTRING` | No | Azure Cosmos DB connection string (uses in-memory if not set) |
| `AZURE_SERVICEBUS_CONNECTIONSTRING` | No | Azure Service Bus connection string for event publishing |
| `AZURE_SERVICEBUS_QUEUE_NAME` | No | Service Bus queue name for events |
| `NODE_ENV` | No | Environment (production/development) |

## 🏗️ SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each class has one reason to change
- Controllers handle HTTP concerns only
- Services orchestrate use cases
- Use cases implement single business operations
- Repositories handle data access only

### Open/Closed Principle (OCP)
- New use cases can be added without modifying existing code
- Repository interface allows different implementations

### Liskov Substitution Principle (LSP)
- Repository implementations can be swapped without breaking the application
- In-memory repository can be replaced with SQL, MongoDB, etc.

### Interface Segregation Principle (ISP)
- Interfaces are focused and specific
- ITaskRepository defines only necessary operations

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (interfaces)
- Controllers depend on services, not concrete implementations
- Services depend on repository interfaces, not implementations

## 🧪 Testing

```bash
npm test
```

## 📄 License

ISC

## 👨‍💻 Author

Senior Node.js Developer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
