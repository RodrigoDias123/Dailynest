from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=50)
    email: str = Field(unique=True, index=True, max_length=100)
    password: str
    
    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user")
    agendas: List["Agenda"] = Relationship(back_populates="user")
    notepads: List["Notepad"] = Relationship(back_populates="user")
    files: List["File"] = Relationship(back_populates="user")