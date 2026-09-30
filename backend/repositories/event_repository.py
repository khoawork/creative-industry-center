from models import Event
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
    event_category = Event.query.filter_by(name=name).first()
    return event_category


def create_event(event_data: Event) -> Event:
    event = Event(
        name=event_data.name,
        description=event_data.description,
        speaker=event_data.speaker,
        location=event_data.location,
        image=event_data.image,
        status=event_data.status,
        btn_action=event_data.btn_action,
        form_url=event_data.form_url,
        category_id=event_data.category_id,
    )
    db.session.add(event)
    db.session.commit()
    return event


def update_event(event_id: int, event_data: Event) -> Event:
    event = Event.query.get(event_id)
    if not event:
        return None

    event.name = event_data.name
    event.description = event_data.description
    event.speaker = event_data.speaker
    event.location = event_data.location
    event.image = event_data.image
    event.status = event_data.status
    event.btn_action = event_data.btn_action
    event.form_url = event_data.form_url
    event.category_id = event_data.category_id

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
    event_category = Event(
        name=category_data.name,
        description=category_data.description,
    )
    db.session.add(event_category)
    db.session.commit()
    return event_category


def delete_event_category(category_id: int) -> bool:
    event_category = Event.query.get(category_id)
    if not event_category:
        return False

    db.session.delete(event_category)
    db.session.commit()
    return True
