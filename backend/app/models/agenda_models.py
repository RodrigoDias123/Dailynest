from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.user_models import User


class Agenda(SQLModel, table=True):
    __tablename__ = "agendas"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime = Field(index=True)
    event: str = Field(index=True, max_length=100)
    category: str = Field(default="Personal", max_length=50)
    
    user_id: int = Field(foreign_key="users.id", nullable=False)
    user: Optional["User"] = Relationship(back_populates="agendas")
