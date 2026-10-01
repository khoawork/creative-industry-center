from repositories import base_repo, introduce_repository
from utils.error import InternalServerError, NotFoundError


def _get_introduce_page(page_id):
    page = base_repo.getPageById(page_id)
    if page is None or page.slug != "introduce":
        raise NotFoundError(message=f"Không tìm thấy trang Giới thiệu (id={page_id}).")
    if not isinstance(page.props, dict):
        raise InternalServerError(message="Dữ liệu props của trang Giới thiệu không hợp lệ.")
    return page


def get_introduce(page_id):
    page = _get_introduce_page(page_id)
    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": dict(page.props),
    }


def update_hero_section(data, page_id):
    page = _get_introduce_page(page_id)
    return introduce_repository.update_hero(page=page, data=data)


def update_overview_section(data, page_id):
    page = _get_introduce_page(page_id)
    return introduce_repository.update_overview(page=page, data=data)


def update_vision_section(data, page_id):
    page = _get_introduce_page(page_id)
    return introduce_repository.update_vision(page=page, data=data)


def update_mission_section(data, page_id):
    page = _get_introduce_page(page_id)
    return introduce_repository.update_mission(page=page, data=data)


def update_core_values_section(data, page_id):
    page = _get_introduce_page(page_id)
    return introduce_repository.update_core_values(page=page, data=data)


def update_actions_section(data, page_id):
    page = _get_introduce_page(page_id)
    return introduce_repository.update_actions(page=page, data=data)
