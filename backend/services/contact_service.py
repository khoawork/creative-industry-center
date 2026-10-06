from urllib.parse import urlencode

from repositories import contact_repository
from utils.error import InternalServerError, NotFoundError


def _get_contact_page(page_id=None):
    page = contact_repository.get_contact_page(page_id)
    if page is None:
        suffix = f" (id={page_id})" if page_id is not None else ""
        raise NotFoundError(message=f"Không tìm thấy trang Liên hệ{suffix}.")
    if not isinstance(page.props, dict):
        raise InternalServerError(message="Dữ liệu props của trang Liên hệ không hợp lệ.")
    return page


def get_contact_page(page_id=None):
    page = _get_contact_page(page_id)
    props = dict(page.props)
    map_location = dict(props.get("mapLocation") or {})
    if not map_location.get("directionsUrl"):
        address = map_location.get("mapAddress") or map_location.get("address")
        if address:
            map_location["directionsUrl"] = f"https://www.google.com/maps/dir/?{urlencode({'api': '1', 'destination': address})}"
            props["mapLocation"] = map_location
    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": props,
    }


def update_contact_props(props, page_id=None):
    page = _get_contact_page(page_id)
    current_props = dict(page.props)
    current_props.update(props)
    map_location = dict(current_props.get("mapLocation") or {})
    if not map_location.get("directionsUrl"):
        address = map_location.get("mapAddress") or map_location.get("address")
        if address:
            map_location["directionsUrl"] = f"https://www.google.com/maps/dir/?{urlencode({'api': '1', 'destination': address})}"
            current_props["mapLocation"] = map_location
    contact_repository.update_contact_props(page, current_props)
    return get_contact_page(page.id)
