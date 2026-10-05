from typing import Any, Dict, Optional
from repositories import base_repo, training_page_repository
from models.PageModel import Page


def _get_training_page(page_id: Optional[int] = None) -> Page:
    page = None
    if page_id is not None:
        page = base_repo.getPageById(page_id)
    if not page or page.slug not in ("trainings", "training"):
        page = base_repo.getPageBySlug("trainings") or base_repo.getPageBySlug("training")
    if not page:
        page = base_repo.getPageById(9)
    return page


def get_training_page(page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_training_page(page_id)
    props = dict(page.props or {})

    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": props,
        "created_date": page.created_date.isoformat() if hasattr(page, "created_date") and page.created_date else None,
        "updated_date": page.updated_date.isoformat() if hasattr(page, "updated_date") and page.updated_date else None,
    }


def update_training_page(page_id: Optional[int] = None, data: Any = None) -> Dict[str, Any]:
    page = _get_training_page(page_id)
    name = data.get("name") if isinstance(data, dict) else getattr(data, "name", None)
    slug = data.get("slug") if isinstance(data, dict) else getattr(data, "slug", None)
    props = data.get("props") if isinstance(data, dict) else getattr(data, "props", None)

    page = base_repo.updatePage(page=page, name=name, slug=slug, props=props)
    return get_training_page(page.id)


def update_header_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_training_page(page_id)
    return training_page_repository.update_header(page=page, data=data)


def update_proposal_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_training_page(page_id)
    return training_page_repository.update_proposal(page=page, data=data)


def update_selected_trainings(training_ids: Any, page_id: Optional[int] = None) -> Any:
    page = _get_training_page(page_id)
    return training_page_repository.update_selected_trainings(page=page, training_ids=training_ids)


def update_models_section(models_data: Any, page_id: Optional[int] = None) -> Any:
    page = _get_training_page(page_id)
    return training_page_repository.update_models(page=page, models_data=models_data)


def update_certification_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_training_page(page_id)
    return training_page_repository.update_certification(page=page, data=data)


