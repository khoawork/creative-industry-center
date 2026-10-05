from extensions import db
from sqlalchemy.orm.attributes import flag_modified
from types import SimpleNamespace
from typing import Any, Dict


def _to_dict(obj: Any) -> Any:
    """Chuyển đổi SimpleNamespace hoặc dict sang định dạng dict chuẩn cho JSON"""
    if isinstance(obj, SimpleNamespace):
        return {k: _to_dict(v) for k, v in vars(obj).items()}
    elif isinstance(obj, dict):
        return {k: _to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_to_dict(item) for item in obj]
    return obj


def update_header(page, data: Any) -> Dict[str, Any]:
    header_data = {
        "badge": getattr(data, "badge", None) if not isinstance(data, dict) else data.get("badge"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "statistics": _to_dict(getattr(data, "statistics", []) if not isinstance(data, dict) else data.get("statistics", [])),
    }
    current_props = dict(page.props or {})
    current_props["header_section"] = header_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return header_data


def update_proposal(page, data: Any) -> Dict[str, Any]:
    proposal_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "benefits": _to_dict(getattr(data, "benefits", []) if not isinstance(data, dict) else data.get("benefits", [])),
        "form_title": getattr(data, "form_title", None) if not isinstance(data, dict) else data.get("form_title"),
        "form_description": getattr(data, "form_description", None) if not isinstance(data, dict) else data.get("form_description"),
        "button_text": getattr(data, "button_text", "GỬI HỒ SƠ ĐĂNG KÝ") if not isinstance(data, dict) else data.get("button_text", "GỬI HỒ SƠ ĐĂNG KÝ"),
        "form_fields": _to_dict(getattr(data, "form_fields", []) if not isinstance(data, dict) else data.get("form_fields", [])),
    }
    current_props = dict(page.props or {})
    current_props["proposal_section"] = proposal_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return proposal_data


def update_selected_trainings(page, training_ids: Any) -> Any:
    current_props = dict(page.props or {})
    current_props["selected_training_ids"] = list(training_ids or [])
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return current_props["selected_training_ids"]


def update_models(page, models_data: Any) -> Any:
    cleaned = _to_dict(models_data)
    current_props = dict(page.props or {})
    current_props["models_section"] = cleaned
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return cleaned


def update_certification(page, data: Any) -> Dict[str, Any]:
    cert_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "items": _to_dict(getattr(data, "items", []) if not isinstance(data, dict) else data.get("items", [])),
        "seal_title": getattr(data, "seal_title", None) if not isinstance(data, dict) else data.get("seal_title"),
        "seal_subtitle": getattr(data, "seal_subtitle", None) if not isinstance(data, dict) else data.get("seal_subtitle"),
        "seal_description": getattr(data, "seal_description", None) if not isinstance(data, dict) else data.get("seal_description"),
        "seal_badge": getattr(data, "seal_badge", None) if not isinstance(data, dict) else data.get("seal_badge"),
    }
    current_props = dict(page.props or {})
    current_props["certification_section"] = cert_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return cert_data


def update_page_props(page, new_props: Dict[str, Any]) -> Dict[str, Any]:
    current_props = dict(page.props or {})
    current_props.update(_to_dict(new_props))
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return current_props


