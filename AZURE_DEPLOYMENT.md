# Azure Deployment Guide

## Prerequisites

1. Azure subscription
2. Azure Web App created (Node 24 LTS runtime)
3. GitHub repository connected

## Deployment via Azure Portal Deployment Center

### Step 1: Create Azure Web App

```bash
az webapp create \
  --resource-group <resource-group-name> \
  --plan <app-service-plan-name> \
  --name <app-name> \
  --runtime "NODE:24-lts"
```

### Step 2: Configure Deployment Center

1. Navigate to Azure Portal → Your Web App
2. Go to **Deployment Center**
3. Select **GitHub** as source
4. Authorize and select:
   - Organization: `celfons`
   - Repository: `node-azure`
   - Branch: `main` (or your branch)

### Step 3: Configure Application Settings

In Azure Portal → Configuration → Application Settings, add:

```
NODE_ENV=production
PORT=8080
WEBSITE_NODE_DEFAULT_VERSION=24.x
```

### Step 4: Configure Startup Command

In Azure Portal → Configuration → General Settings:

**Startup Command:**
```bash
npm start
```

### Step 5: Build Configuration

Azure will automatically:
1. Run `npm install`
2. Run `npm run build`
3. Start the app with `npm start`

## Manual Deployment (Alternative)

### Using Azure CLI

```bash
# Build locally
npm run build

# Deploy
az webapp up \
  --name <app-name> \
  --resource-group <resource-group-name> \
  --runtime "NODE:24-lts"
```

### Using Git

```bash
# Add Azure remote
az webapp deployment source config-local-git \
  --name <app-name> \
  --resource-group <resource-group-name>

# Get credentials
az webapp deployment list-publishing-credentials \
  --name <app-name> \
  --resource-group <resource-group-name>

# Deploy
git remote add azure <git-url>
git push azure main
```

## Verify Deployment

After deployment, test your endpoints:

```bash
# Replace <app-name> with your Azure app name
curl https://<app-name>.azurewebsites.net/
curl https://<app-name>.azurewebsites.net/api/hello/health
curl https://<app-name>.azurewebsites.net/api/tasks
```

## Environment Variables

Configure in Azure Portal → Configuration:

| Variable | Value | Description |
|----------|-------|-------------|
| NODE_ENV | production | Node environment |
| PORT | 8080 | Server port |
| WEBSITE_NODE_DEFAULT_VERSION | 24.x | Node version |
| AZURE_COSMOS_CONNECTIONSTRING | (your connection string) | Azure Cosmos DB connection string (optional, for persistent storage) |

### Azure Cosmos DB Configuration

To enable persistent task storage with Azure Cosmos DB (MongoDB API):

#### Compatibility Requirements

This application uses **MongoDB Node.js driver version 6.21.0**, which is compatible with:
- **Azure Cosmos DB for MongoDB API version 4.0** (wire protocol version 7)
- MongoDB server versions 3.6 and higher

**Critical**: Ensure your Cosmos DB account uses MongoDB API **version 4.0 or higher**. To check or upgrade:
1. Navigate to Azure Portal → Your Cosmos DB Account → Features
2. Find "MongoDB server version"
3. Upgrade to version 4.0 or higher if needed

#### Configuration Steps

1. Create an Azure Cosmos DB account with MongoDB API (version 4.0 or higher)
2. Navigate to Azure Portal → Your Cosmos DB Account → Connection Strings
3. Copy the primary or secondary connection string
4. In Azure Portal → Your Web App → Configuration → Application Settings
5. Add new application setting:
   - Name: `AZURE_COSMOS_CONNECTIONSTRING`
   - Value: Your Cosmos DB connection string (e.g., `mongodb://your-cosmos-account:key@your-cosmos-account.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@your-cosmos-account@`)
6. Save and restart the application

If `AZURE_COSMOS_CONNECTIONSTRING` is not set, the application will use in-memory storage (tasks will be lost on restart).

## Troubleshooting

### View Logs

```bash
az webapp log tail --name <app-name> --resource-group <resource-group-name>
```

Or in Azure Portal:
1. Navigate to your Web App
2. Go to **Log stream**

### Common Issues

1. **App not starting**: Check logs and ensure `npm start` command is correct
2. **Build failing**: Verify all dependencies are in `package.json`
3. **Port issues**: Ensure app uses `process.env.PORT || 8080`
4. **Wire version mismatch**: If you see errors like "Server reports maximum wire version X, but this version requires at least Y":
   - Check your Cosmos DB MongoDB server version in Azure Portal (Cosmos DB Account → Features)
   - Ensure you are using MongoDB API version 4.0 or higher
   - The error message will provide specific instructions for your situation

## Monitoring

Enable Application Insights for monitoring:

```bash
az webapp config appsettings set \
  --name <app-name> \
  --resource-group <resource-group-name> \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<key>
```

## Scaling

Configure auto-scaling in Azure Portal:
1. Navigate to **Scale out (App Service plan)**
2. Configure based on CPU/Memory metrics

## Continuous Deployment

GitHub Actions workflow is automatically created when using Deployment Center. It will:
1. Build the app on every push
2. Run tests (if configured)
3. Deploy to Azure automatically
