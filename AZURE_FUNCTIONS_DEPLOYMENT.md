# Azure Functions Deployment Guide

This application has been configured to run as Azure Functions, providing a serverless deployment option alongside the traditional Azure Web App deployment.

## 🚀 Overview

The application now supports two deployment models:

1. **Azure Functions** (Serverless) - Recommended for event-driven workloads and pay-per-execution pricing
2. **Azure Web App** (Traditional) - Best for consistent traffic patterns

## 📦 Azure Functions Structure

The application has been converted to Azure Functions while maintaining the clean architecture principles:

```
src/
├── functions/              # Azure Function handlers
│   ├── helloWorld.ts       # GET /
│   ├── helloApi.ts         # GET /api/hello
│   ├── healthCheck.ts      # GET /api/hello/health
│   ├── getAllTasks.ts      # GET /api/tasks
│   ├── getTaskById.ts      # GET /api/tasks/{id}
│   ├── createTask.ts       # POST /api/tasks
│   ├── updateTask.ts       # PUT /api/tasks/{id}
│   └── deleteTask.ts       # DELETE /api/tasks/{id}
├── infrastructure.ts       # Shared dependency injection
├── domain/                 # Business logic (unchanged)
├── application/            # Use cases (unchanged)
├── infrastructure/         # Repositories and messaging (unchanged)
└── presentation/           # Controllers (reused by functions)
```

## 🛠️ Local Development

### Prerequisites

1. **Node.js 20+** - Required for running the application
2. **Azure Functions Core Tools** - Install via:
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create local settings**:
   ```bash
   cp local.settings.json.example local.settings.json
   ```

3. **Configure environment** (edit `local.settings.json`):
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "NODE_ENV": "development",
       "AZURE_COSMOS_CONNECTIONSTRING": "",
       "AZURE_SERVICEBUS_CONNECTIONSTRING": "",
       "AZURE_SERVICEBUS_QUEUE_NAME": ""
     }
   }
   ```

### Running Locally

1. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

2. **Start Azure Functions runtime**:
   ```bash
   npm run start:func
   ```
   Or directly:
   ```bash
   func start
   ```

3. **Access the endpoints**:
   - Hello World: `http://localhost:7071/`
   - API Hello: `http://localhost:7071/api/hello`
   - Health Check: `http://localhost:7071/api/hello/health`
   - Tasks API: `http://localhost:7071/api/tasks`

## ☁️ Azure Deployment

### Option 1: Deploy via Azure Portal

1. **Create Azure Function App**:
   - Go to Azure Portal
   - Create new Function App
   - Select:
     - Runtime: Node.js
     - Version: 20 LTS
     - Operating System: Linux
     - Plan: Consumption (Serverless) or Premium

2. **Configure Application Settings**:
   - Go to Function App → Configuration → Application Settings
   - Add:
     ```
     AZURE_COSMOS_CONNECTIONSTRING=<your-connection-string>
     AZURE_SERVICEBUS_CONNECTIONSTRING=<your-connection-string>
     AZURE_SERVICEBUS_QUEUE_NAME=<your-queue-name>
     NODE_ENV=production
     ```

3. **Deploy via Deployment Center**:
   - Go to Function App → Deployment Center
   - Connect your GitHub repository
   - Azure will automatically build and deploy

### Option 2: Deploy via Azure CLI

1. **Login to Azure**:
   ```bash
   az login
   ```

2. **Create Resource Group** (if needed):
   ```bash
   az group create --name myResourceGroup --location eastus
   ```

3. **Create Storage Account** (required for Functions):
   ```bash
   az storage account create \
     --name mystorageaccount \
     --location eastus \
     --resource-group myResourceGroup \
     --sku Standard_LRS
   ```

4. **Create Function App**:
   ```bash
   az functionapp create \
     --resource-group myResourceGroup \
     --consumption-plan-location eastus \
     --runtime node \
     --runtime-version 20 \
     --functions-version 4 \
     --name myFunctionApp \
     --storage-account mystorageaccount \
     --os-type Linux
   ```

5. **Deploy the application**:
   ```bash
   npm run build
   func azure functionapp publish myFunctionApp
   ```

6. **Configure Application Settings**:
   ```bash
   az functionapp config appsettings set \
     --name myFunctionApp \
     --resource-group myResourceGroup \
     --settings \
     "AZURE_COSMOS_CONNECTIONSTRING=<your-connection-string>" \
     "AZURE_SERVICEBUS_CONNECTIONSTRING=<your-connection-string>" \
     "AZURE_SERVICEBUS_QUEUE_NAME=<your-queue-name>" \
     "NODE_ENV=production"
   ```

### Option 3: Deploy via VS Code

1. **Install Azure Functions Extension** for VS Code
2. **Sign in to Azure**
3. **Click on Azure icon** in sidebar
4. **Deploy to Function App**:
   - Right-click on the Functions folder
   - Select "Deploy to Function App"
   - Choose your subscription and Function App
   - Confirm deployment

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_COSMOS_CONNECTIONSTRING` | No | Connection string for Azure Cosmos DB (MongoDB API). If not set, uses in-memory storage. |
| `AZURE_SERVICEBUS_CONNECTIONSTRING` | No | Connection string for Azure Service Bus. Required only if you want to publish events. |
| `AZURE_SERVICEBUS_QUEUE_NAME` | No | Name of the Service Bus queue. Required only if you want to publish events. |
| `NODE_ENV` | No | Environment mode (development/production). Defaults to development. |

### Azure Cosmos DB Setup

1. Create an Azure Cosmos DB account with MongoDB API (version 4.0+)
2. Get the connection string from Azure Portal
3. Add it to Function App Configuration

### Azure Service Bus Setup (Optional)

1. Create an Azure Service Bus namespace
2. Create a queue within the namespace
3. Get the connection string
4. Add connection string and queue name to Function App Configuration

## 🔍 Monitoring

### Application Insights

Azure Functions automatically integrates with Application Insights:

1. Enable Application Insights in Function App settings
2. View metrics, logs, and traces in Azure Portal
3. Monitor function executions, failures, and performance

### Logging

All functions log to Application Insights:
- Function execution logs
- Error logs
- Custom logs via `context.log()`

Access logs via:
- Azure Portal → Function App → Monitor
- Application Insights → Logs
- Azure CLI: `func azure functionapp logstream myFunctionApp`

## 📊 API Endpoints

All endpoints from the original Express application are available:

### Hello World
- `GET /` - Hello World message
- `GET /api/hello` - Hello World message
- `GET /api/hello/health` - Health check endpoint

### Tasks CRUD
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## 🧪 Testing

### Test Hello World
```bash
curl https://myFunctionApp.azurewebsites.net/
```

### Test Create Task
```bash
curl -X POST https://myFunctionApp.azurewebsites.net/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing Azure Functions"
  }'
```

### Test Get All Tasks
```bash
curl https://myFunctionApp.azurewebsites.net/api/tasks
```

## 💰 Cost Optimization

### Consumption Plan
- **Pay per execution**: Only charged when functions run
- **Free grant**: 1 million executions and 400,000 GB-s per month
- **Best for**: Variable workloads, development, testing

### Premium Plan
- **Pre-warmed instances**: No cold start
- **Enhanced performance**: Better for production workloads
- **Best for**: High-traffic applications, consistent workload

## 🔒 Security

### Authentication Levels
Functions are currently set to `anonymous` for easy testing. For production:

1. **Change auth level** in function code:
   ```typescript
   app.http('functionName', {
     methods: ['GET'],
     authLevel: 'function', // or 'admin'
     handler: handlerFunction
   });
   ```

2. **Use Function Keys**: 
   - Get keys from Azure Portal → Function App → App Keys
   - Include in requests: `?code=<function-key>`

3. **Use Azure AD**: Configure Azure AD authentication in Function App settings

## 🔄 CI/CD

Azure Functions supports CI/CD via:

1. **GitHub Actions** - Automatically set up via Deployment Center
2. **Azure DevOps** - Create pipelines for build and deploy
3. **Azure CLI** - Script deployments

Example GitHub Actions workflow is automatically created when connecting via Deployment Center.

## 📚 Additional Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Functions Node.js Developer Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [Azure Cosmos DB MongoDB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/mongodb-introduction)
- [Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)

## 🐛 Troubleshooting

### Function not responding
- Check Function App logs in Azure Portal
- Verify environment variables are set correctly
- Ensure the build completed successfully

### Cold start issues
- Consider using Premium Plan for pre-warmed instances
- Or implement keep-alive mechanisms

### Database connection errors
- Verify Cosmos DB connection string is correct
- Ensure Cosmos DB is using MongoDB API version 4.0+
- Check network connectivity and firewall rules

## 🎯 Next Steps

1. ✅ Deploy to Azure Function App
2. ✅ Configure Application Insights for monitoring
3. ✅ Set up CI/CD pipeline
4. ✅ Configure authentication for production
5. ✅ Test all endpoints thoroughly
6. ✅ Monitor performance and costs
