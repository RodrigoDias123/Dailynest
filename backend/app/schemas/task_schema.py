from typing import Optional
from sqlmodel import SQLModel
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "Personal"
    status: str = "Not-Started"
    priority: str = "medium"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class TaskPublic(TaskBase):
    id: int
    user_id: int
    user: Optional["UserPublic"] = None

from app.schemas.user_schema import UserPublic