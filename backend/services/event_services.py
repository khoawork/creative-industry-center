from repositories import event_repository as event_repo
from dto import event_dto
from repositories import base_repo
from utils.error import InternalServerError, NotFoundError


def is_unique_name(name: str, event_id: int = None) -> bool:
    existing_event = event_repo.get_event_by_name(name)

    if existing_event:
        if not event_id or existing_event.id != event_id:
            return False

    return True


def get_event_by_id(event_id: int) -> event_dto.EventResponse:
    event = event_repo.get_event_by_id(event_id)
    return event


def get_all_events() -> list[event_dto.EventResponse]:
    events = event_repo.get_all_events()
    return events


def get_event_categories() -> list[event_dto.EventCategoryResponse]:
    return event_repo.get_all_event_categories()


def _validate_event_category(event_data):
    category_id = getattr(event_data, "category_id", None)
    if category_id is not None:
        if event_repo.get_event_category_by_id(category_id) is None:
            raise ValueError("Event category not found")
        return
    category = getattr(event_data, "category", None)
    if not category or not getattr(category, "name", None):
        raise ValueError("Event category is required")


def create_event(event_data: event_dto.EventRequest) -> event_dto.EventResponse:
    if not event_data:
        raise ValueError("Event data is required")

    is_unique = is_unique_name(name=event_data.name)
    if not is_unique:
        raise ValueError("Event name must be unique")

    _validate_event_category(event_data)
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

    if event_repo.get_event_by_id(event_id) is None:
        return None
    _validate_event_category(event_data)
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

    if event_repo.get_event_category_by_name(category_data.name):
        raise ValueError("Event category name must be unique")

    category = event_repo.create_event_category(category_data)

    return category


def update_event_category(category_id, category_data):
    category = event_repo.get_event_category_by_id(category_id)
    if category is None:
        raise NotFoundError(message="Không tìm thấy chuyên mục.")
    existing = event_repo.get_event_category_by_name(category_data.name)
    if existing and existing.id != category_id:
        raise ValueError("Tên chuyên mục đã tồn tại.")
    return event_repo.update_event_category(category, category_data)


def delete_event_category(category_id):
    if event_repo.has_events_in_category(category_id):
        raise ValueError("Chuyên mục đang được sự kiện sử dụng.")
    if not event_repo.delete_event_category(category_id):
        raise NotFoundError(message="Không tìm thấy chuyên mục.")


def get_events_page(page_id):
    page = base_repo.getPageById(page_id)
    if page is None or page.slug != "events":
        page = base_repo.getPageBySlug("events")
    if page is None:
        raise NotFoundError(message=f"Không tìm thấy trang Sự kiện (id={page_id}).")
    if not isinstance(page.props, dict):
        raise InternalServerError(message="Nội dung trang Sự kiện không hợp lệ.")
    return page


def update_hero_section(data, page_id):
    return event_repo.update_hero(get_events_page(page_id), data)


def update_filter_section(data, page_id):
    return event_repo.update_filter(get_events_page(page_id), data)


def update_displayed_events(data, page_id):
    event_ids = list(dict.fromkeys(data["event_ids"]))
    return event_repo.update_displayed_events(
        get_events_page(page_id), {"event_ids": event_ids}
    )


def update_newsletter_section(data, page_id):
    return event_repo.update_newsletter(get_events_page(page_id), data)
