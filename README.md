# DailyNest

> One nest for every task.

DailyNest is a personal productivity web application that centralises tasks, agenda events, notes, and files in a single interface. It follows a classic client-server architecture: a FastAPI REST API backed by PostgreSQL, and a vanilla HTML/CSS/JavaScript frontend served through Nginx — all orchestrated with Docker Compose.

---

## Project Structure

```
Dailynest/
├── backend/          # FastAPI REST API (Python 3.12 + SQLModel)
├── frontend/         # Vanilla JS SPA served by Nginx
├── compose.yml       # Docker Compose orchestration
├── Makefile          # Shortcut commands
├── .env.example      # Environment variable template
└── logs/             # Persistent log volume
```

---

## Features

| Module   | Description                                      |
|----------|--------------------------------------------------|
| Auth     | JWT-based registration and login                 |
| Tasks    | Create, update, and delete to-do items           |
| Agenda   | Schedule and manage calendar events              |
| Notepad  | Free-form personal notes                         |
| Files    | File upload and management                       |
| Profile  | User account settings                            |

---

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose v2
- `make` (optional, for shortcut commands)
- A `.env` file at the project root (see below)

---

## Environment Setup

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

`.env.example`:

```env
# PostgreSQL
DB_USER=dailynestUser
DB_PASSWORD=dailynest!
DB_NAME=dailynestDB

# FastAPI JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# pgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin!
```

---

## Running the Application

```bash
# Build images and start all services in the background
make start

# Stop all services
make stop

# Stop and remove all containers + images (full reset)
make clean
```

Or directly with Docker Compose:

```bash
docker compose up -d --build
```

### Service URLs

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:8080       |
| API       | http://localhost:8000       |
| API Docs  | http://localhost:8000/docs  |
| pgAdmin   | http://localhost:5050       |

---

## Services Overview

| Container  | Image / Build          | Port mapping |
|------------|------------------------|--------------|
| `db`       | postgres:15-alpine     | 5433 → 5432  |
| `api`      | ./backend (Python 3.12)| 8000 → 8000  |
| `frontend` | ./frontend (Nginx)     | 8080 → 80    |
| `pgadmin`  | dpage/pgadmin4         | 5050 → 80    |

---

## Documentation

- [Backend README](backend/README.md) — API structure, endpoints, and development guide
- [Frontend README](frontend/README.md) — Page structure, JS modules, and styling guide
