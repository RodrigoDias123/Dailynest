# DailyNest — Backend

REST API built with **FastAPI** and **Python 3.12**, using **SQLModel** as the ORM and **PostgreSQL** as the database. Authentication is handled with JWT tokens.

---

## Tech Stack

| Tool            | Version   | Purpose                        |
|-----------------|-----------|--------------------------------|
| Python          | 3.12      | Runtime                        |
| FastAPI         | ≥ 0.111   | Web framework                  |
| Uvicorn         | ≥ 0.29    | ASGI server                    |
| SQLModel        | 0.0.16    | ORM (SQLAlchemy + Pydantic)    |
| Alembic         | ≥ 1.13    | Database migrations            |
| psycopg         | ≥ 3.1     | PostgreSQL driver              |
| PyJWT           | ≥ 2.8     | JWT token generation/validation|
| passlib/bcrypt  | —         | Password hashing               |
| Pydantic        | ≥ 2.7     | Data validation and settings   |
| uv              | latest    | Package and environment manager|

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── config.py        # Settings from environment variables
│   │   ├── database.py      # SQLModel engine and session
│   │   ├── exceptions.py    # Custom HTTP exceptions
│   │   └── logging.py       # Structured logger setup
│   ├── models/              # SQLModel table definitions
│   │   ├── user_models.py
│   │   ├── task_models.py
│   │   ├── agenda_models.py
│   │   ├── notepad_models.py
│   │   └── file_models.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── user_schema.py
│   │   ├── task_schema.py
│   │   ├── agenda_schema.py
│   │   ├── notepad_schema.py
│   │   └── file_schema.py
│   ├── routers/             # Route handlers (one per domain)
│   │   ├── auth_router.py
│   │   ├── user_router.py
│   │   ├── task_router.py
│   │   ├── agenda_router.py
│   │   ├── notepad_router.py
│   │   └── file_router.py
│   └── services/            # Business logic layer
│       ├── auth_service.py
│       ├── user_service.py
│       ├── task_service.py
│       ├── agenda_service.py
│       ├── notepad_service.py
│       └── file_service.py
├── Dockerfile
└── pyproject.toml
```

---

## API Endpoints

### Auth — `/auth`

| Method | Path             | Description              | Auth required |
|--------|------------------|--------------------------|---------------|
| POST   | `/auth/register` | Register a new user      | No            |
| POST   | `/auth/login`    | Login and receive a JWT  | No            |

### Users — `/users`

| Method | Path        | Description           | Auth required |
|--------|-------------|-----------------------|---------------|
| GET    | `/users/me` | Get current user info | Yes           |
| PUT    | `/users/me` | Update current user   | Yes           |

### Tasks — `/tasks`

| Method | Path          | Description    | Auth required |
|--------|---------------|----------------|---------------|
| GET    | `/tasks`      | List all tasks | Yes           |
| POST   | `/tasks`      | Create a task  | Yes           |
| PUT    | `/tasks/{id}` | Update a task  | Yes           |
| DELETE | `/tasks/{id}` | Delete a task  | Yes           |

### Agenda — `/agenda`

| Method | Path            | Description     | Auth required |
|--------|-----------------|-----------------|---------------|
| GET    | `/agenda`       | List all events | Yes           |
| POST   | `/agenda`       | Create an event | Yes           |
| PUT    | `/agenda/{id}`  | Update an event | Yes           |
| DELETE | `/agenda/{id}`  | Delete an event | Yes           |

### Notepad — `/notepad`

| Method | Path       | Description    | Auth required |
|--------|------------|----------------|---------------|
| GET    | `/notepad` | Get user notes | Yes           |
| POST   | `/notepad` | Save notes     | Yes           |

### Files — `/files`

| Method | Path          | Description   | Auth required |
|--------|---------------|---------------|---------------|
| GET    | `/files`      | List files    | Yes           |
| POST   | `/files`      | Upload a file | Yes           |
| DELETE | `/files/{id}` | Delete a file | Yes           |

Interactive documentation is available at **http://localhost:8000/docs** when the API is running.

---

## Environment Variables

The API reads its configuration from the environment (set via `.env` at the project root):

| Variable                      | Description                          |
|-------------------------------|--------------------------------------|
| `DATABASE_URL`                | PostgreSQL connection string         |
| `SECRET_KEY`                  | Secret used to sign JWT tokens       |
| `ALGORITHM`                   | JWT signing algorithm (e.g. `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes            |

---

## Running Locally (without Docker)

> Requires Python 3.12 and a running PostgreSQL instance.

```bash
cd backend

# Install dependencies
uv sync

# Export environment variables
export DATABASE_URL="postgresql+psycopg://user:password@localhost:5432/dailynestDB"
export SECRET_KEY="your-secret-key"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES=60

# Start the development server with hot-reload
uv run uvicorn app.main:app --reload --port 8000
```

## Running with Docker

From the project root:

```bash
docker compose up -d api db
```

---

## Architecture

Requests flow through the layers in this order:

```
Router → Schema (validation) → Service (business logic) → Model (DB structure) → Database
```

- **Routers** handle HTTP concerns only (parsing, status codes, logging).
- **Services** contain all business logic and interact with the database.
- **Models** define the database tables via SQLModel.
- **Schemas** define the shapes of request bodies and response payloads independently from the models, keeping the API contract decoupled from the DB structure.
- Tables are auto-created on startup via `create_tables()` in `app/core/database.py`.
