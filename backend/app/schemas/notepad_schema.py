from typing import Optional
from sqlmodel import SQLModel


class NotepadBase(SQLModel):
    title: str
    content: Optional[str] = None
    category: str = "Personal"

class NotepadCreate(NotepadBase):
    user_id: int

class NotepadUpdate(SQLModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None

class NotepadPublic(NotepadBase):
    id: int
    user_id: int