from typing import Any, Dict, Optional
from repositories import base_repo, forum_page_repository
from utils.error import NotFoundError
from models.PageModel import Page


def _get_forum_page(page_id: Optional[int] = None) -> Page:
    page = None
    if page_id is not None:
        page = base_repo.getPageById(page_id)
    if not page or page.slug != "forum":
        page = base_repo.getPageBySlug("forum")
    if not page:
        page = base_repo.getPageById(8)
    if not page:
        raise NotFoundError("Không tìm thấy trang Diễn đàn Kinh tế Kỷ lục")
    return page


def get_forum_page(page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    props = page.props or {}

    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": props,
        "created_date": page.created_date.isoformat() if hasattr(page, "created_date") and page.created_date else None,
        "updated_date": page.updated_date.isoformat() if hasattr(page, "updated_date") and page.updated_date else None,
    }


def update_forum_page(page_id: Optional[int] = None, data: Any = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    name = data.get("name") if isinstance(data, dict) else getattr(data, "name", None)
    slug = data.get("slug") if isinstance(data, dict) else getattr(data, "slug", None)
    props = data.get("props") if isinstance(data, dict) else getattr(data, "props", None)

    page = base_repo.updatePage(page=page, name=name, slug=slug, props=props)
    return get_forum_page(page.id)


def update_header_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_header(page=page, data=data)


def update_hero_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_hero(page=page, data=data)


def update_pillars_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_pillars(page=page, data=data)


def update_speakers_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_speakers(page=page, data=data)


def update_agenda_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_agenda(page=page, data=data)


def update_awards_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_awards(page=page, data=data)


def update_partners_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_partners(page=page, data=data)


def update_registration_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_registration(page=page, data=data)