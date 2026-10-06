from typing import Any, Dict, Optional
from repositories import base_repo, project_page_repository
from utils.error import NotFoundError
from models.PageModel import Page
from extensions import db




def _get_project_page(page_id: Optional[int] = None) -> Page:
    page = None
    if page_id is not None:
        page = base_repo.getPageById(page_id)
    if not page or page.slug != "projects":
        page = base_repo.getPageBySlug("projects")
    if not page:
        page = base_repo.getPageById(5)
    if not page:
        raise NotFoundError(message="Không tìm thấy trang Dự án (projects)")
    return page


def get_project_page(page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_project_page(page_id)
    props = dict(page.props or {})

    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": props,
        "created_date": page.created_date.isoformat() if hasattr(page, "created_date") and page.created_date else None,
        "updated_date": page.updated_date.isoformat() if hasattr(page, "updated_date") and page.updated_date else None,
    }


def update_project_page(page_id: Optional[int] = None, data: Any = None) -> Dict[str, Any]:
    page = _get_project_page(page_id)
    name = data.get("name") if isinstance(data, dict) else getattr(data, "name", None)
    slug = data.get("slug") if isinstance(data, dict) else getattr(data, "slug", None)
    props = data.get("props") if isinstance(data, dict) else getattr(data, "props", None)

    page = base_repo.updatePage(page=page, name=name, slug=slug, props=props)
    return get_project_page(page.id)


def update_header_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_project_page(page_id)
    return project_page_repository.update_header(page=page, data=data)


def update_proposal_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_project_page(page_id)
    return project_page_repository.update_proposal(page=page, data=data)


def update_selected_projects(project_ids: Any, page_id: Optional[int] = None) -> Any:
    page = _get_project_page(page_id)
    return project_page_repository.update_selected_projects(page=page, project_ids=project_ids)
