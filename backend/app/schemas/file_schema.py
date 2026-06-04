from typing import Optional
from sqlmodel import SQLModel


class FileBase(SQLModel):
    filename: str
    filepath: str
    category: str = "Personal"

class FileCreate(FileBase):
    user_id: int

class FileUpdate(SQLModel):
    filename: Optional[str] = None
    filepath: Optional[str] = None
    category: Optional[str] = None

class FilePublic(FileBase):
    id: int
    user_id: int