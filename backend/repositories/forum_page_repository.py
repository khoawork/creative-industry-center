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
        "top_back_text": getattr(data, "top_back_text", None) if not isinstance(data, dict) else data.get("top_back_text"),
        "top_back_link": getattr(data, "top_back_link", None) if not isinstance(data, dict) else data.get("top_back_link"),
        "top_slogan": getattr(data, "top_slogan", None) if not isinstance(data, dict) else data.get("top_slogan"),
        "top_hotline": getattr(data, "top_hotline", None) if not isinstance(data, dict) else data.get("top_hotline"),
        "logo_image": getattr(data, "logo_image", None) if not isinstance(data, dict) else data.get("logo_image"),
        "brand_title": getattr(data, "brand_title", None) if not isinstance(data, dict) else data.get("brand_title"),
        "brand_subtitle": getattr(data, "brand_subtitle", None) if not isinstance(data, dict) else data.get("brand_subtitle"),
        "nav_items": _to_dict(getattr(data, "nav_items", []) if not isinstance(data, dict) else data.get("nav_items", [])),
        "button_text": getattr(data, "button_text", None) if not isinstance(data, dict) else data.get("button_text"),
        "button_link": getattr(data, "button_link", None) if not isinstance(data, dict) else data.get("button_link"),
        "show_user_icon": getattr(data, "show_user_icon", True) if not isinstance(data, dict) else data.get("show_user_icon", True),
    }
    current_props = dict(page.props or {})
    current_props["header_section"] = header_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return header_data


def update_hero(page, data: Any) -> Dict[str, Any]:
    hero_data = {
        "badge": getattr(data, "badge", None) if not isinstance(data, dict) else data.get("badge"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "subtitle": getattr(data, "subtitle", None) if not isinstance(data, dict) else data.get("subtitle"),
        "motto": getattr(data, "motto", None) if not isinstance(data, dict) else data.get("motto"),
        "event_date": getattr(data, "event_date", None) if not isinstance(data, dict) else data.get("event_date"),
        "event_location": getattr(data, "event_location", None) if not isinstance(data, dict) else data.get("event_location"),
        "top_logo_image": getattr(data, "top_logo_image", None) if not isinstance(data, dict) else data.get("top_logo_image"),
        "banner_image": getattr(data, "banner_image", None) if not isinstance(data, dict) else data.get("banner_image"),
        "primary_button_text": getattr(data, "primary_button_text", None) if not isinstance(data, dict) else data.get("primary_button_text"),
        "primary_button_link": getattr(data, "primary_button_link", None) if not isinstance(data, dict) else data.get("primary_button_link"),
        "secondary_button_text": getattr(data, "secondary_button_text", None) if not isinstance(data, dict) else data.get("secondary_button_text"),
        "secondary_button_link": getattr(data, "secondary_button_link", None) if not isinstance(data, dict) else data.get("secondary_button_link"),
    }
    current_props = dict(page.props or {})
    current_props["hero_section"] = hero_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return hero_data


def update_pillars(page, data: Any) -> Dict[str, Any]:
    pillars_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "pillars": _to_dict(getattr(data, "pillars", []) if not isinstance(data, dict) else data.get("pillars", [])),
    }
    current_props = dict(page.props or {})
    current_props["pillars_section"] = pillars_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return pillars_data


def update_speakers(page, data: Any) -> Dict[str, Any]:
    speakers_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "speakers": _to_dict(getattr(data, "speakers", []) if not isinstance(data, dict) else data.get("speakers", [])),
    }
    current_props = dict(page.props or {})
    current_props["speakers_section"] = speakers_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return speakers_data


def update_agenda(page, data: Any) -> Dict[str, Any]:
    agenda_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "certificate_title": getattr(data, "certificate_title", None) if not isinstance(data, dict) else data.get("certificate_title"),
        "certificate_subtitle": getattr(data, "certificate_subtitle", None) if not isinstance(data, dict) else data.get("certificate_subtitle"),
        "sessions": _to_dict(getattr(data, "sessions", []) if not isinstance(data, dict) else data.get("sessions", [])),
    }
    current_props = dict(page.props or {})
    current_props["agenda_section"] = agenda_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return agenda_data


def update_awards(page, data: Any) -> Dict[str, Any]:
    awards_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "award_ids": list(getattr(data, "award_ids", []) if not isinstance(data, dict) else data.get("award_ids", [])),
    }
    current_props = dict(page.props or {})
    current_props["awards_section"] = awards_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return awards_data


def update_partners(page, data: Any) -> Dict[str, Any]:
    partners_data = {
        "organizers_tag": getattr(data, "organizers_tag", None) if not isinstance(data, dict) else data.get("organizers_tag"),
        "organizers": _to_dict(getattr(data, "organizers", []) if not isinstance(data, dict) else data.get("organizers", [])),
        "sponsors_tag": getattr(data, "sponsors_tag", None) if not isinstance(data, dict) else data.get("sponsors_tag"),
        "sponsors": _to_dict(getattr(data, "sponsors", []) if not isinstance(data, dict) else data.get("sponsors", [])),
    }
    current_props = dict(page.props or {})
    current_props["partners_section"] = partners_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return partners_data


def update_registration(page, data: Any) -> Dict[str, Any]:
    reg_data = {
        "tag": getattr(data, "tag", None) if not isinstance(data, dict) else data.get("tag"),
        "title": getattr(data, "title", None) if not isinstance(data, dict) else data.get("title"),
        "description": getattr(data, "description", None) if not isinstance(data, dict) else data.get("description"),
        "hotline": getattr(data, "hotline", None) if not isinstance(data, dict) else data.get("hotline"),
        "email": getattr(data, "email", None) if not isinstance(data, dict) else data.get("email"),
        "address": getattr(data, "address", None) if not isinstance(data, dict) else data.get("address"),
        "privacy_text": getattr(data, "privacy_text", None) if not isinstance(data, dict) else data.get("privacy_text"),
        "button_text": getattr(data, "button_text", None) if not isinstance(data, dict) else data.get("button_text"),
        "form_fields": _to_dict(getattr(data, "form_fields", []) if not isinstance(data, dict) else data.get("form_fields", [])),
    }
    current_props = dict(page.props or {})
    current_props["registration_section"] = reg_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return reg_data


def update_page_props(page, new_props: Dict[str, Any]) -> Dict[str, Any]:
    current_props = dict(page.props or {})
    current_props.update(_to_dict(new_props))
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return current_props
