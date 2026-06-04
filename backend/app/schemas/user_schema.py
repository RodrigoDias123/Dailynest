from typing import Optional
from sqlmodel import SQLModel
from pydantic import BaseModel

#User
#shared fields used by multiple user schemas
class UserBase(SQLModel):
    name: str
    email: str

#Data required when a client registers a new user
class UserCreate(UserBase):
    password: str

#Dields allowed when updating a user
class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

#ASafe user representation returned by the API
class UserPublic(BaseModel):
    id: int
    name: str
    email: str


#Authentication
#Credentials provided by the client during login
class UserLogin(SQLModel):
    email: str
    password: str

#JWT access token returned after successful authentication
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

#Payload extracted from a decoded JWT
class TokenData(SQLModel):
    user_id: Optional[int] = None