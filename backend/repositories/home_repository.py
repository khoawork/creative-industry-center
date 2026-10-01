from extensions import db
from sqlalchemy.orm.attributes import flag_modified
from types import SimpleNamespace
from utils.error import NotFoundError
from typing import Any, Dict, List, Optional


def _to_dict(obj: Any) -> Any:
    """Chuyển đổi SimpleNamespace hoặc dict sang định dạng dict chuẩn cho JSON"""
    if isinstance(obj, SimpleNamespace):
        return {k: _to_dict(v) for k, v in vars(obj).items()}
    elif isinstance(obj, dict):
        return {k: _to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_to_dict(item) for item in obj]
    return obj


# ==========================================
# 1. HERO SECTION
# ==========================================

def update_hero(page, data):
    hero_data = {
        "badge": data.badge,
        "title_main": data.title_main,
        "subtitle": data.subtitle,
        "quote": data.quote,
        "buttons": _to_dict(data.buttons),
        "statistics": _to_dict(data.statistics)
    }
    current_props = dict(page.props or {})
    current_props["hero_section"] = hero_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return hero_data


# ==========================================
# 2. ABOUT SECTION
# ==========================================

def update_about(page, data):
    about_data = {
        "tag": data.tag,
        "title_main": data.title_main,
        "featured_image": _to_dict(data.featured_image),
        "core_values": _to_dict(data.core_values),
        "action_button": _to_dict(data.action_button)
    }
    current_props = dict(page.props or {})
    current_props["about_section"] = about_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return about_data



def create_nav(page, data):
    current_props = dict(page.props )
    nav_list = list(current_props.get("nav_sections") or [])

    new_id = (max([int(n.get("id", 0)) for n in nav_list], default=0) + 1) if nav_list else 1

    children_id = getattr(data, "children_id", [])
    if children_id is None:
        children_id = []
    else:
        children_id = _to_dict(children_id)

    new_nav = {
        "id": new_id,
        "tag": data.tag,
        "title_main": data.title_main,
        "action_button": _to_dict(data.action_button),
        "children_id": children_id
    }

    nav_list.append(new_nav)
    current_props["nav_section"] = new_nav  # Lưu nav hiện tại / mới nhất
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return new_nav



def add_children_to_nav(page, nav_id, children_ids):
    current_props = dict(page.props) if page.props else {}
    nav_found = False
    
    for nav in current_props["nav_sections"]:
        if nav.get("id") == nav_id:
            # Hỗ trợ lấy dữ liệu dù truyền vào dict hay list trực tiếp
            nav["children_id"] = children_ids.get("children_id") if isinstance(children_ids, dict) else children_ids
            nav_found = True
            break

    if not nav_found:
        raise NotFoundError(message=f"Không tìm thấy nav section với ID: {nav_id}")

    page.props = current_props            
    flag_modified(page, "props")    
    db.session.commit()    
    
    return page


def delete_children_to_nav(page, nav_id, children_id):
    current_props = dict(page.props) if page.props else {}
    
    raw_ids = children_id
    if isinstance(children_id, dict):
        raw_ids = children_id.get("children_id", [])

    if isinstance(raw_ids, (int, str)):
        targets_to_remove = {str(raw_ids)}
    elif isinstance(raw_ids, list):
        targets_to_remove = {str(x) for x in raw_ids}
    else:
        targets_to_remove = set()

    nav_found = False
    for nav in current_props["nav_sections"]:
        if nav.get("id") == nav_id:
            current_children = nav.get("children_id", [])
            nav["children_id"] = [x for x in current_children if str(x) not in targets_to_remove]
            
            nav_found = True
            break

    if not nav_found:
        raise NotFoundError(message=f"Không tìm thấy nav section với ID: {nav_id}")

    page.props = current_props            
    flag_modified(page, "props")    
    db.session.commit()    
    
    return page


def get_nav(page, nav_id):
    if not page or not page.props:
        raise NotFoundError(message="Không tìm thấy page hoặc props trống")
    nav_sections = page.props.get("nav_sections", [])
    for nav in nav_sections:
        if nav.get("id") == nav_id:
            return nav            
    raise NotFoundError(message=f"Không tìm thấy nav section với ID: {nav_id}")


def get_all_navs(page):
    if not page or not page.props:
        return []
    return page.props.get("nav_sections", [])


def update_nav(page, nav_id, data):
    if not page:
        raise NotFoundError(message="Không tìm thấy page")
    current_props = dict(page.props) if page.props else {}
    
    if "nav_sections" not in current_props or not isinstance(current_props["nav_sections"], list):
        raise NotFoundError(message="Không tìm thấy danh sách nav_sections trong trang này")

    nav_data = data.dict() if hasattr(data, 'dict') else (data.__dict__ if hasattr(data, '__dict__') else data)

    nav_found = False
    for nav in current_props["nav_sections"]:
        if nav.get("id") == nav_id:
            children_id_old = nav.get("children_id", [])
            
            nav.update(nav_data)
            
            nav["id"] = nav_id
            
            if "children_id" not in nav or nav["children_id"] is None:
                nav["children_id"] = children_id_old

            nav_found = True
            break

    if not nav_found:
        raise NotFoundError(message=f"Không tìm thấy nav section với ID: {nav_id}")

    page.props = current_props            
    flag_modified(page, "props")    
    db.session.commit()    
    
    return page
    


def update_support_banner(page, data):
    banner_data = {
        "text": data.text,
        "button": _to_dict(data.button)
    }
    current_props = dict(page.props or {})
    current_props["support_banner"] = banner_data
    page.props = current_props
    flag_modified(page, "props")
    db.session.commit()
    return banner_data