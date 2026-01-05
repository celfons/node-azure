# Azure Function - Task Queue Service

A simple, production-ready Azure Function built with Node.js 24 LTS and TypeScript that receives HTTP POST requests and forwards them to an Azure Service Bus Queue.

## 🚀 Features

- **Single Azure Function** with two HTTP triggers:
  - `POST /api/tasks` - Receives task creation requests and sends them to queue
  - `GET /api/health` - Health check endpoint
- **Queue-Only Architecture**: No database dependency, only forwards messages to Azure Service Bus Queue
- **Request-to-Message Mapping**: Decouples HTTP adapter from queue message format
- **TypeScript**: Type-safe development
- **Clean Architecture**: Separation of concerns with clear boundaries

## 📦 Architecture

This application follows a simplified architecture focused on message forwarding:

```
src/
├── functions/              # Azure Function handlers
│   └── queueHandler.ts     # Single function with POST and health triggers
├── domain/                 # Domain models
│   ├── interfaces/         # Contracts (IQueuePublisher)
│   └── messages/           # Message DTOs (TaskRequestMessage)
├── infrastructure/         # External integrations
│   ├── mappers/            # Request-to-Message mappers
│   └── messaging/          # Queue publisher implementations
└── simpleInfrastructure.ts # Dependency injection setup
```

## 🛠️ Technologies

- **Node.js 24 LTS**: Latest long-term support version
- **TypeScript 5.x**: Type-safe JavaScript
- **Azure Functions**: Serverless computing platform
- **Azure Service Bus**: Message queue service

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd node-azure

# Install dependencies
npm install
```

## ⚙️ Configuration

Configure the following environment variables in `local.settings.json` (for local development) or Azure Function App Configuration (for production):

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_SERVICEBUS_CONNECTIONSTRING` | Yes | Azure Service Bus connection string |
| `AZURE_SERVICEBUS_QUEUE_NAME` | Yes | Service Bus queue name where messages will be sent |
| `NODE_ENV` | No | Environment (production/development) |

### Example local.settings.json

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",
    "AZURE_SERVICEBUS_CONNECTIONSTRING": "Endpoint=sb://...",
    "AZURE_SERVICEBUS_QUEUE_NAME": "tasks-queue"
  }
}
```

## 🏃‍♂️ Running Locally

```bash
# Build the application
npm run build

# Start Azure Functions runtime
npm run start:func
# Or: func start
```

Access at `http://localhost:7071/`

## 🔗 API Endpoints

### POST /api/tasks
Sends a task creation request to the queue.

**Request:**
```bash
curl -X POST http://localhost:7071/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description"
  }'
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Task request sent to queue for processing",
  "requestId": "req_1234567890_abc123"
}
```

### GET /api/health
Health check endpoint to verify the service is operational.

**Request:**
```bash
curl http://localhost:7071/api/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "message": "Queue service is operational",
  "timestamp": "2026-01-05T00:00:00.000Z",
  "uptime": 123.456
}
```

## 📨 Message Format

The function converts HTTP requests to the following queue message format:

```typescript
{
  "title": string,           // Task title from request
  "description": string,     // Task description from request
  "requestTimestamp": string, // ISO 8601 timestamp
  "requestId": string        // Unique request ID for tracing
}
```

This decouples the HTTP adapter from downstream queue consumers.

## ☁️ Azure Deployment

### Prerequisites
- Azure CLI installed
- Azure Functions Core Tools installed
- Azure Service Bus namespace and queue created

### Deploy to Azure

```bash
# Build the application
npm run build:production

# Deploy to Azure Function App
func azure functionapp publish <your-function-app-name>
```

### Configure in Azure

1. Navigate to your Azure Function App in Azure Portal
2. Go to **Configuration** → **Application Settings**
3. Add the required environment variables:
   - `AZURE_SERVICEBUS_CONNECTIONSTRING`
   - `AZURE_SERVICEBUS_QUEUE_NAME`
4. Save and restart the function app

## 🧪 Testing

Build the project to verify everything is working:

```bash
npm run build
```

Test locally using the Azure Functions Core Tools:

```bash
npm run start:func
```

## 📝 Design Principles

### Request-to-Message Decoupling
The `TaskRequestMapper` converts HTTP request bodies to `TaskRequestMessage` objects, ensuring:
- HTTP adapter and queue message format are independent
- Queue consumers don't depend on HTTP request structure
- Easy to evolve either side independently

### Single Responsibility
The function has one responsibility: receive HTTP requests and forward them to a queue.
- No business logic
- No database operations
- Pure message forwarding

### Clean Architecture
- **Domain Layer**: Message contracts and interfaces
- **Infrastructure Layer**: Queue publisher implementations and mappers
- **Function Layer**: HTTP trigger handlers

## 📄 License

ISC

## 👨‍💻 Author

Senior Node.js Developer
