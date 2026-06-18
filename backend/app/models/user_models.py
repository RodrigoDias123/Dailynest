from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.task_models import Task
    from app.models.agenda_models import Agenda
    from app.models.notepad_models import Notepad
    from app.models.file_models import File


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=15)
    email: str = Field(unique=True, index=True, max_length=100)
    password: str
    
    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user")
    agendas: List["Agenda"] = Relationship(back_populates="user")
    notepads: List["Notepad"] = Relationship(back_populates="user")
    files: List["File"] = Relationship(back_populates="user")