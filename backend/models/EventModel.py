from enum import Enum
from extensions import db
from .BaseModel import BaseModel


class EventStatus(str, Enum):
    PENDING = "PENDING"
    REGISTRATION_OPEN = "REGISTRATION_OPEN"
    UPCOMING = "UPCOMING"
    ENDED = "ENDED"


event_status = EventStatus


class Event(BaseModel):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    speaker = db.Column(db.JSON, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(500), nullable=True)
    status = db.Column(
        db.Enum(EventStatus, name="event_status", native_enum=False),
        default=EventStatus.PENDING,
        nullable=False
    )