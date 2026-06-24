from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_tables
from app.routers.task_router import router as task_router
from app.routers.auth_router import router as auth_router
from app.routers.user_router import router as user_router
from app.routers.agenda_router import router as agenda_router
from app.routers.notepad_router import router as notepad_router
from app.routers.file_router import router as file_router

# Create tables on startup
create_tables()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "Working"}

# Include all routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(task_router)
app.include_router(agenda_router)
app.include_router(notepad_router)
app.include_router(file_router)