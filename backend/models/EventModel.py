from enum import Enum
from extensions import db
from .BaseModel import BaseModel


class EventStatus(str, Enum):
    PENDING = "PENDING"
    REGISTRATION_OPEN = "REGISTRATION_OPEN"
    UPCOMING = "UPCOMING"
    ENDED = "ENDED"


class Event(BaseModel):
    __tablename__ = "event"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    speaker = db.Column(db.JSON, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    event_date = db.Column(db.Date, nullable=True)
    image = db.Column(db.String(500), nullable=True)
    status = db.Column(
        db.Enum(EventStatus, name="event_status", native_enum=False),
        default=EventStatus.PENDING,
        nullable=False,
    )
    btn_action = db.Column(db.String(255), nullable=True)
    form_url = db.Column(db.String(255), nullable=True)

    category_id = db.Column(
        db.Integer, db.ForeignKey("event_category.id"), nullable=False
    )
    category = db.relationship("EventCategory", backref="events")


class EventCategory(BaseModel):
    __tablename__ = "event_category"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)


class EventNewsletterSubscription(BaseModel):
    __tablename__ = "event_newsletter_subscription"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    page_id = db.Column(db.Integer, db.ForeignKey("page.id"), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    organization = db.Column(db.String(255), nullable=False, default="")
    email = db.Column(db.String(254), nullable=False)
    consent = db.Column(db.Boolean, nullable=False)
    __table_args__ = (db.UniqueConstraint("page_id", "email", name="uq_event_newsletter_page_email"),)
