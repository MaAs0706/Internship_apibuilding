from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, Event, Attendee
from auth import get_current_user

router = APIRouter(prefix="/api/v1/events", tags=["attendees"])


@router.post("/{event_id}/join", status_code=status.HTTP_201_CREATED)
def join_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    
   
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
   
    if event.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is cancelled"
        )
    
    
    existing = db.query(Attendee).filter(
        Attendee.event_id == event_id,
        Attendee.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already joined this event"
        )
    
    
    attendee_count = db.query(Attendee).filter(
        Attendee.event_id == event_id
    ).count()
    if attendee_count >= event.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full"
        )
    
    
    attendee = Attendee(event_id=event_id, user_id=current_user.id)
    db.add(attendee)
    db.commit()
    db.refresh(attendee)
    
    return {"message": "Successfully joined event"}


@router.post("/{event_id}/leave", status_code=status.HTTP_200_OK)
def leave_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
   
    
    
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    
    attendee = db.query(Attendee).filter(
        Attendee.event_id == event_id,
        Attendee.user_id == current_user.id
    ).first()
    if not attendee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not joined to this event"
        )
    
    
    db.delete(attendee)
    db.commit()
    
    return {"message": "Successfully left event"}