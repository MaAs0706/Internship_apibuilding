from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user") 
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
   
    events = relationship("Event", back_populates="creator")
  
    attendances = relationship("Attendee", back_populates="user")


class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    date = Column(DateTime)
    capacity = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))  
    cancelled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    
    creator = relationship("User", back_populates="events")
    
    attendees = relationship("Attendee", back_populates="event", cascade="all, delete-orphan")


class Attendee(Base):
    __tablename__ = "attendees"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id")) 
    user_id = Column(Integer, ForeignKey("users.id"))  
    joined_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    
    event = relationship("Event", back_populates="attendees")
    
    user = relationship("User", back_populates="attendances")