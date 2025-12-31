# SOLID Principles Applied

This document explains how SOLID principles are implemented in this application.

## Overview

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.

## 1. Single Responsibility Principle (SRP)

**"A class should have one, and only one, reason to change."**

### Implementation in this project:

#### Domain Layer
- **Task Entity** (`src/domain/entities/Task.ts`): Only responsible for task business logic and behavior
- **ITaskRepository** (`src/domain/interfaces/ITaskRepository.ts`): Only defines the contract for data operations

#### Application Layer
- **CreateTaskUseCase**: Only handles task creation logic
- **GetAllTasksUseCase**: Only retrieves all tasks
- **GetTaskByIdUseCase**: Only retrieves a specific task
- **UpdateTaskUseCase**: Only handles task updates
- **DeleteTaskUseCase**: Only handles task deletion
- **TaskService**: Orchestrates use cases, doesn't contain business logic

#### Infrastructure Layer
- **InMemoryTaskRepository**: Only responsible for data persistence

#### Presentation Layer
- **TaskController**: Only handles HTTP requests/responses
- **HelloController**: Only handles hello and health endpoints
- **errorHandler**: Only handles errors
- **requestLogger**: Only logs requests

## 2. Open/Closed Principle (OCP)

**"Software entities should be open for extension, but closed for modification."**

### Implementation in this project:

#### Repository Pattern
```typescript
// Interface is closed for modification
interface ITaskRepository {
  findAll(): Promise<Task[]>;
  // ... other methods
}

// But open for extension - we can create new implementations
class InMemoryTaskRepository implements ITaskRepository { }
class SQLTaskRepository implements ITaskRepository { }
class MongoTaskRepository implements ITaskRepository { }
```

You can add new repository implementations without modifying existing code:
- Want to use PostgreSQL? Create `PostgreSQLTaskRepository`
- Want to use MongoDB? Create `MongoDBTaskRepository`
- Want to use Redis? Create `RedisTaskRepository`

#### Use Cases
New use cases can be added without modifying existing ones:
- Want to search tasks? Add `SearchTasksUseCase`
- Want to archive tasks? Add `ArchiveTaskUseCase`
- Want to export tasks? Add `ExportTasksUseCase`

## 3. Liskov Substitution Principle (LSP)

**"Derived classes must be substitutable for their base classes."**

### Implementation in this project:

Any implementation of `ITaskRepository` can be substituted without breaking the application:

```typescript
// Currently using in-memory
const taskRepository = new InMemoryTaskRepository();
const taskService = new TaskService(taskRepository);

// Can easily swap to SQL without changing TaskService
const taskRepository = new SQLTaskRepository();
const taskService = new TaskService(taskRepository);

// Or MongoDB
const taskRepository = new MongoDBTaskRepository();
const taskService = new TaskService(taskRepository);
```

The `TaskService` doesn't care which implementation is used, as long as it follows the `ITaskRepository` contract.

## 4. Interface Segregation Principle (ISP)

**"Clients should not be forced to depend on interfaces they do not use."**

### Implementation in this project:

#### Focused Interfaces
Our `ITaskRepository` only includes methods that are actually needed:

```typescript
interface ITaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Task): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
```

If we needed additional functionality (e.g., bulk operations), we would create a separate interface:

```typescript
interface IBulkTaskRepository extends ITaskRepository {
  bulkCreate(tasks: Task[]): Promise<Task[]>;
  bulkDelete(ids: string[]): Promise<boolean>;
}
```

This way, simple implementations don't need to implement bulk operations they don't support.

## 5. Dependency Inversion Principle (DIP)

**"High-level modules should not depend on low-level modules. Both should depend on abstractions."**

### Implementation in this project:

#### Before (Bad - Direct Dependency)
```typescript
// Controller depends on concrete implementation
class TaskController {
  constructor(private repository: InMemoryTaskRepository) {}
}
```

#### After (Good - Dependency on Abstraction)
```typescript
// Controller depends on interface (abstraction)
class TaskController {
  constructor(private taskService: TaskService) {}
}

class TaskService {
  constructor(private taskRepository: ITaskRepository) {}
}
```

#### Dependency Flow
```
Presentation Layer (Controllers)
        ↓ depends on
Application Layer (Services)
        ↓ depends on
Domain Layer (Interfaces)
        ↑ implemented by
Infrastructure Layer (Repositories)
```

High-level modules (Controllers, Services) depend on abstractions (Interfaces), not concrete implementations.

#### Dependency Injection
Dependencies are injected through constructors:

```typescript
// Manual DI in app.ts
const taskRepository = new InMemoryTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);
```

This makes testing easy:

```typescript
// Testing with mock
const mockRepository = new MockTaskRepository();
const taskService = new TaskService(mockRepository);
// Test taskService with mock data
```

## Benefits Achieved

1. **Testability**: Easy to test with mocks and stubs
2. **Maintainability**: Changes are localized and don't ripple through the codebase
3. **Flexibility**: Easy to swap implementations (database, external services, etc.)
4. **Scalability**: New features can be added without modifying existing code
5. **Readability**: Clear separation of concerns makes code easier to understand

## Clean Code Practices

In addition to SOLID, this project follows these clean code practices:

1. **Meaningful Names**: Classes, methods, and variables have clear, descriptive names
2. **Small Functions**: Functions do one thing and do it well
3. **Clear Comments**: Only when necessary, code is self-documenting
4. **Error Handling**: Proper error handling with try-catch blocks
5. **Consistent Formatting**: TypeScript and ESLint ensure consistent style
6. **DRY (Don't Repeat Yourself)**: No code duplication
7. **Type Safety**: Full TypeScript typing for compile-time safety

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│  (Controllers, Routes, Middlewares)                      │
│  - HTTP Request/Response handling                        │
└────────────────────┬────────────────────────────────────┘
                     │ depends on
┌────────────────────▼────────────────────────────────────┐
│                 Application Layer                        │
│  (Services, Use Cases)                                   │
│  - Business logic orchestration                          │
└────────────────────┬────────────────────────────────────┘
                     │ depends on
┌────────────────────▼────────────────────────────────────┐
│                   Domain Layer                           │
│  (Entities, Interfaces)                                  │
│  - Business rules and contracts                          │
└────────────────────▲────────────────────────────────────┘
                     │ implemented by
┌────────────────────┴────────────────────────────────────┐
│               Infrastructure Layer                       │
│  (Repositories, External Services)                       │
│  - Technical implementation details                      │
└─────────────────────────────────────────────────────────┘
```

## Future Enhancements

Following SOLID makes these enhancements easy:

1. **Add Database**: Create `SQLTaskRepository` implementing `ITaskRepository`
2. **Add Authentication**: Create `AuthMiddleware` in presentation layer
3. **Add Caching**: Create `CachedTaskRepository` decorator
4. **Add Validation**: Create validation middleware or use cases
5. **Add Logging**: Create logging service using DI
6. **Add Testing**: Mock repositories and services easily

All without modifying existing code!
