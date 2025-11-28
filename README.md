# Reservoir

A modern React application built with Vite, TanStack Router, and Tailwind CSS for reservoir management.

## 🔧 Prerequisites

- **Docker Desktop**: v20.10 or higher
  - **Important**: Docker Desktop must be running before executing docker-compose commands

## 🐳 Running with Docker

> **⚠️ Before you start**: Make sure Docker Desktop is running on your machine

### Development Mode

```bash
docker-compose up reservoir-dev
```

Access at: [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
docker-compose up reservoir-prod
```

Access at: [http://localhost](http://localhost)

### Useful Commands

**Run in background:**

```bash
docker-compose up -d reservoir-dev
```

**Stop:**

```bash
docker-compose down
```

**View logs:**

```bash
docker-compose logs -f reservoir-dev
```

## 🛠️ Main Technologies

- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Shadcn/ui](https://ui.shadcn.com/)** - UI component library
- **[Axios](https://axios-http.com/)** - HTTP client

## 🐛 Troubleshooting

### Docker Desktop not running

**Error:**
```
unable to get image 'reservoir-reservoir-dev': error during connect: ... The system cannot find the file specified.
```

**Solution:**
1. Open Docker Desktop application
2. Wait until it's fully started (icon should be green/active in system tray)
3. Run the docker-compose command again

### Version warning

**Warning:**
```
the attribute `version` is obsolete, it will be ignored
```

This is just a warning and can be safely ignored. The docker-compose file will work correctly.

