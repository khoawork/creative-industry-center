from repositories import event_repository as event_repo
from dto import event_dto


def is_unique_name(name: str, event_id: int = None) -> bool:
    existing_event = event_repo.get_event_by_name(name)
    existing_event_category = event_repo.get_event_category_by_name(name)

    if existing_event:
        if not event_id or existing_event.id != event_id:
            return False
    if existing_event_category:
        if not event_id or existing_event_category.id != event_id:
            return False

    return True


def get_event_by_id(event_id: int) -> event_dto.EventResponse:
    event = event_repo.get_event_by_id(event_id)
    return event


def get_all_events() -> list[event_dto.EventResponse]:
    events = event_repo.get_all_events()
    return events


def create_event(event_data: event_dto.EventRequest) -> event_dto.EventResponse:
    if not event_data:
        raise ValueError("Event data is required")

    is_unique = is_unique_name(name=event_data.name)
    if not is_unique:
        raise ValueError("Event name must be unique")

    event = event_repo.create_event(event_data)

    return event


def update_event(
    event_id: int, event_data: event_dto.EventRequest
) -> event_dto.EventResponse:
    if not event_data:
        raise ValueError("Event data is required")

    is_unique = is_unique_name(name=event_data.name, event_id=event_id)
    if not is_unique:
        raise ValueError("Event name must be unique")

    event = event_repo.update_event(event_id, event_data)

    return event


def update_event_status(event_id: int, status: str) -> event_dto.EventResponse:
    if not event_id:
        raise ValueError("Event ID is required")

    if not status:
        raise ValueError("Event status is required")

    event = event_repo.update_event_status(event_id, status)

    return event


def delete_event(event_id: int) -> bool:
    if not event_id:
        raise ValueError("Event ID is required")

    return event_repo.delete_event(event_id)


def create_event_category(
    category_data: event_dto.EventCategoryRequestDTO,
) -> event_dto.EventCategoryResponse:
    if not category_data:
        raise ValueError("Event category data is required")

    is_unique = is_unique_name(name=category_data.name)
    if not is_unique:
        raise ValueError("Event category name must be unique")

    category = event_repo.create_event_category(category_data)

    return category
