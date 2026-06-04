from typing import Optional
from sqlmodel import SQLModel


class AgendaBase(SQLModel):
    date: str
    event: str
    category: str = "Personal"

class AgendaCreate(AgendaBase):
    user_id: int

class AgendaUpdate(SQLModel):
    date: Optional[str] = None
    event: Optional[str] = None
    category: Optional[str] = None

class AgendaPublic(AgendaBase):
    id: int
    user_id: int