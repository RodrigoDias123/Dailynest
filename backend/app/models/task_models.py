from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.user_models import User


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True, max_length=100)
    description: Optional[str] = None
    category: str = Field(default="Personal", max_length=20)
    status: str = Field(default="Not-Started", max_length=20)
    priority: str = Field(default="medium", max_length=20)

    user_id: int = Field(foreign_key="users.id", nullable=False)
    user: Optional["User"] = Relationship(back_populates="tasks")
