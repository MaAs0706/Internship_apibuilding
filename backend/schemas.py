from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional



class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True




class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse




class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    capacity: int

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    capacity: Optional[int] = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    capacity: int
    user_id: int
    cancelled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True