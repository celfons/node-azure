# API Testing Guide

This document provides examples of how to test all API endpoints.

## Prerequisites

Make sure the server is running:
```bash
npm run dev  # Development mode
# or
npm start    # Production mode
```

## Base URL

- Local: `http://localhost:8080`
- Azure: `https://<your-app-name>.azurewebsites.net`

---

## Hello World & Health Endpoints

### 1. Hello World (Root)
**GET /**

```bash
curl http://localhost:8080/
```

**Response:**
```json
{
  "success": true,
  "message": "Hello World from Node.js 24 LTS with TypeScript!",
  "timestamp": "2025-12-31T15:00:00.000Z",
  "environment": "development"
}
```

### 2. Hello World (API)
**GET /api/hello**

```bash
curl http://localhost:8080/api/hello
```

**Response:** Same as above

### 3. Health Check
**GET /api/hello/health**

```bash
curl http://localhost:8080/api/hello/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2025-12-31T15:00:00.000Z"
}
```

---

## Tasks CRUD Endpoints

### 1. Create Task
**POST /api/tasks**

**Headers:**
- Content-Type: application/json

**Body:**
```json
{
  "title": "My Task",
  "description": "Task description"
}
```

**Example:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Complete TypeScript tutorial"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_1234567890_abc123",
    "title": "Learn TypeScript",
    "description": "Complete TypeScript tutorial",
    "completed": false,
    "createdAt": "2025-12-31T15:00:00.000Z",
    "updatedAt": "2025-12-31T15:00:00.000Z"
  }
}
```

### 2. Get All Tasks
**GET /api/tasks**

```bash
curl http://localhost:8080/api/tasks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_1234567890_abc123",
      "title": "Learn TypeScript",
      "description": "Complete TypeScript tutorial",
      "completed": false,
      "createdAt": "2025-12-31T15:00:00.000Z",
      "updatedAt": "2025-12-31T15:00:00.000Z"
    },
    {
      "id": "task_9876543210_xyz789",
      "title": "Build API",
      "description": "Create REST API with Node.js",
      "completed": true,
      "createdAt": "2025-12-31T14:00:00.000Z",
      "updatedAt": "2025-12-31T15:30:00.000Z"
    }
  ]
}
```

### 3. Get Task by ID
**GET /api/tasks/:id**

```bash
curl http://localhost:8080/api/tasks/task_1234567890_abc123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_1234567890_abc123",
    "title": "Learn TypeScript",
    "description": "Complete TypeScript tutorial",
    "completed": false,
    "createdAt": "2025-12-31T15:00:00.000Z",
    "updatedAt": "2025-12-31T15:00:00.000Z"
  }
}
```

**Error Response (Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

### 4. Update Task
**PUT /api/tasks/:id**

**Headers:**
- Content-Type: application/json

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true
}
```

**Example:**
```bash
curl -X PUT http://localhost:8080/api/tasks/task_1234567890_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript - Completed",
    "description": "Completed TypeScript tutorial",
    "completed": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_1234567890_abc123",
    "title": "Learn TypeScript - Completed",
    "description": "Completed TypeScript tutorial",
    "completed": true,
    "createdAt": "2025-12-31T15:00:00.000Z",
    "updatedAt": "2025-12-31T16:00:00.000Z"
  }
}
```

### 5. Delete Task
**DELETE /api/tasks/:id**

```bash
curl -X DELETE http://localhost:8080/api/tasks/task_1234567890_abc123
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Title and description are required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Failed to create task",
  "error": "Error details (only in development)"
}
```

---

## Testing with Different Tools

### Using cURL (Command Line)

```bash
# Create
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test task"}'

# Read All
curl http://localhost:8080/api/tasks

# Read One
curl http://localhost:8080/api/tasks/TASK_ID

# Update
curl -X PUT http://localhost:8080/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated task","completed":true}'

# Delete
curl -X DELETE http://localhost:8080/api/tasks/TASK_ID
```

### Using Postman

1. **Import Collection**: Create a new collection named "Node Azure CRUD"
2. **Add Requests**: Create requests for each endpoint
3. **Set Environment**: Create environment with `baseUrl` variable
4. **Test**: Run the collection to test all endpoints

### Using HTTPie

```bash
# Create
http POST localhost:8080/api/tasks title="Test" description="Test task"

# Read All
http GET localhost:8080/api/tasks

# Read One
http GET localhost:8080/api/tasks/TASK_ID

# Update
http PUT localhost:8080/api/tasks/TASK_ID \
  title="Updated" description="Updated task" completed:=true

# Delete
http DELETE localhost:8080/api/tasks/TASK_ID
```

### Using JavaScript/Fetch

```javascript
// Create Task
fetch('http://localhost:8080/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Task',
    description: 'Task description'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Get All Tasks
fetch('http://localhost:8080/api/tasks')
.then(res => res.json())
.then(data => console.log(data));

// Update Task
fetch('http://localhost:8080/api/tasks/TASK_ID', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Task',
    description: 'Updated description',
    completed: true
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Delete Task
fetch('http://localhost:8080/api/tasks/TASK_ID', {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Complete Test Workflow

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "1. Testing Hello World..."
curl $BASE_URL/

echo -e "\n\n2. Testing Health Check..."
curl $BASE_URL/api/hello/health

echo -e "\n\n3. Creating Task 1..."
TASK1=$(curl -s -X POST $BASE_URL/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task 1","description":"First task"}')
TASK1_ID=$(echo $TASK1 | jq -r '.data.id')
echo $TASK1

echo -e "\n\n4. Creating Task 2..."
TASK2=$(curl -s -X POST $BASE_URL/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task 2","description":"Second task"}')
TASK2_ID=$(echo $TASK2 | jq -r '.data.id')
echo $TASK2

echo -e "\n\n5. Getting All Tasks..."
curl $BASE_URL/api/tasks

echo -e "\n\n6. Getting Task 1 by ID..."
curl $BASE_URL/api/tasks/$TASK1_ID

echo -e "\n\n7. Updating Task 1..."
curl -X PUT $BASE_URL/api/tasks/$TASK1_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Task 1 Updated","description":"Updated first task","completed":true}'

echo -e "\n\n8. Deleting Task 2..."
curl -X DELETE $BASE_URL/api/tasks/$TASK2_ID

echo -e "\n\n9. Final Task List..."
curl $BASE_URL/api/tasks

echo -e "\n\nAll tests completed!"
```

Save this as `test-api.sh`, make it executable (`chmod +x test-api.sh`), and run it (`./test-api.sh`).

---

## Notes

- All endpoints return JSON responses
- Successful responses have `"success": true`
- Error responses have `"success": false`
- Task IDs are automatically generated
- Dates are in ISO 8601 format
- The API uses in-memory storage (data is lost on restart)
