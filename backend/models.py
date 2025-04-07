from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Note(BaseModel):
    title: str
    content: str
    user: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    tags: list[str]
    is_archived: bool

class UpdateNotes(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    updated_at: datetime
    tags: Optional[list[str]] = None
    is_archived: Optional[bool] = None

class UsernameData(BaseModel):
    username: str
    email: str
    password: str

class LoginCheck(BaseModel):
    username: str
    password: str