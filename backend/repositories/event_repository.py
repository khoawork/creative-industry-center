from models import Event, EventCategory
from extensions import db


def get_all_events() -> list[Event]:
    events = Event.query.all()
    return events


def get_event_by_id(event_id: int) -> Event:
    event = Event.query.get(event_id)
    return event


def get_event_by_name(name: str) -> Event:
    event = Event.query.filter_by(name=name).first()
    return event


def get_event_category_by_name(name: str) -> Event:
    event_category = EventCategory.query.filter_by(name=name).first()
    return event_category


def get_all_event_categories() -> list[EventCategory]:
    return EventCategory.query.order_by(EventCategory.name.asc()).all()


def _get_or_create_category(category_data) -> EventCategory:
    category_id = getattr(category_data, "category_id", None)
    if category_id is not None:
        category = EventCategory.query.get(category_id)
        if not category:
            raise ValueError("Event category not found")
        return category

    category_data = getattr(category_data, "category", None)
    if not category_data or not category_data.name:
        raise ValueError("Event category is required")

    category = get_event_category_by_name(category_data.name)
    if not category:
        category = EventCategory(name=category_data.name)
        db.session.add(category)
        db.session.flush()
    return category


def create_event(event_data: Event) -> Event:
    category = _get_or_create_category(event_data)
    event = Event(
        name=event_data.name,
        description=event_data.description,
        speaker=event_data.speakers,
        location=event_data.location,
        image=event_data.image,
        status=event_data.status,
        btn_action=event_data.btn_action,
        form_url=event_data.form_url,
        category_id=category.id,
    )
    db.session.add(event)
    db.session.commit()
    return event


def update_event(event_id: int, event_data: Event) -> Event:
    event = Event.query.get(event_id)
    if not event:
        return None

    category = _get_or_create_category(event_data)

    event.name = event_data.name
    event.description = event_data.description
    event.speaker = event_data.speakers
    event.location = event_data.location
    event.image = event_data.image
    event.status = event_data.status
    event.btn_action = event_data.btn_action
    event.form_url = event_data.form_url
    event.category_id = category.id

    db.session.commit()
    return event


def update_event_status(event_id: int, status: str) -> Event:
    event = Event.query.get(event_id)
    if not event:
        return None

    event.status = status
    db.session.commit()
    return event


def delete_event(event_id: int) -> bool:
    event = Event.query.get(event_id)
    if not event:
        return False

    db.session.delete(event)
    db.session.commit()
    return True


def create_event_category(category_data: Event) -> Event:
    event_category = EventCategory(name=category_data.name)
    db.session.add(event_category)
    db.session.commit()
    return event_category


def delete_event_category(category_id: int) -> bool:
    event_category = EventCategory.query.get(category_id)
    if not event_category:
        return False

    db.session.delete(event_category)
    db.session.commit()
    return True
