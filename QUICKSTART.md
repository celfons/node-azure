# Quick Start Guide

Get up and running with the Node.js CRUD API in minutes!

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Node.js 24 LTS
Download and install from [nodejs.org](https://nodejs.org/)

### Step 2: Clone & Install
```bash
git clone <repository-url>
cd node-azure
npm install
```

### Step 3: Run the App
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

The server starts on http://localhost:8080

### Step 4: Test It!
Open your browser or use curl:

```bash
# Hello World
curl http://localhost:8080/

# Create a task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Task","description":"Testing the API"}'

# Get all tasks
curl http://localhost:8080/api/tasks
```

That's it! You're ready to go! 🎉

---

## 📚 What You Can Do

### Available Endpoints

1. **Hello World**
   - `GET /` - Welcome message
   - `GET /api/hello/health` - Health check

2. **Tasks CRUD**
   - `GET /api/tasks` - List all tasks
   - `GET /api/tasks/:id` - Get specific task
   - `POST /api/tasks` - Create new task
   - `PUT /api/tasks/:id` - Update task
   - `DELETE /api/tasks/:id` - Delete task

---

## 🛠️ Development Tips

### Available Scripts
```bash
npm run dev      # Development with auto-reload
npm run build    # Build TypeScript to JavaScript
npm start        # Run production build
```

### Project Structure
```
src/
├── domain/           # Business entities and rules
├── application/      # Use cases and services
├── infrastructure/   # Data access (repositories)
├── presentation/     # API controllers and routes
└── config/          # App configuration
```

### Adding a New Feature

1. **Add Entity** (if needed): `src/domain/entities/`
2. **Add Repository** (if needed): `src/infrastructure/repositories/`
3. **Add Use Case**: `src/application/use-cases/`
4. **Add Controller**: `src/presentation/controllers/`
5. **Add Routes**: `src/presentation/routes/`
6. **Wire it up**: Update `src/config/app.ts`

---

## 🎯 Common Tasks

### Change the Port
Edit `.env` or set environment variable:
```bash
PORT=3000 npm start
```

### Add Database
1. Create new repository implementing `ITaskRepository`
2. Replace `InMemoryTaskRepository` in `src/config/app.ts`
3. No other changes needed! (Thanks to SOLID principles)

### Add Authentication
1. Create middleware in `src/presentation/middlewares/`
2. Add to routes in `src/config/app.ts`

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Change port in .env
PORT=3001

# Or kill the process
lsof -ti:8080 | xargs kill
```

### TypeScript errors?
```bash
# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Need help?
Check out:
- `README.md` - Full documentation
- `API_TESTING.md` - API testing guide
- `SOLID_PRINCIPLES.md` - Architecture details
- `AZURE_DEPLOYMENT.md` - Deployment guide

---

## 📦 Next Steps

1. **Test the API**: Use Postman collection (`postman_collection.json`)
2. **Read the docs**: Check `README.md` for detailed info
3. **Deploy to Azure**: Follow `AZURE_DEPLOYMENT.md`
4. **Learn the architecture**: Read `SOLID_PRINCIPLES.md`

---

## 💡 Pro Tips

- Use `npm run dev` during development for auto-reload
- Check logs in console for request tracking
- Use Postman collection for easy API testing
- Environment variables go in `.env` (copy from `.env.example`)
- TypeScript will catch most errors before runtime

---

Happy coding! 🚀
