from typing import Optional, Dict, Any, List
from repositories import home_repository
from repositories import base_repo
from utils.error import NotFoundError
from models.PageModel import Page
from dto.home_dto import (
    HeroSectionRequestDTO,
    AboutSectionRequestDTO,
    NavSectionRequestDTO,
    SupportBannerRequestDTO,
)





def get_home(idPage=None) -> Dict[str, Any]:
    page = base_repo.getPageById(idPage)
    props = dict(page.props or {})

    props.pop("forum_section", None)

    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": props,
        "created_date": page.created_date.isoformat() if hasattr(page, "created_date") and page.created_date else None,
        "updated_date": page.updated_date.isoformat() if hasattr(page, "updated_date") and page.updated_date else None,
    }


# ==========================================
# 1. HERO SECTION
# ==========================================

def update_hero_section(data: HeroSectionRequestDTO, idPage=None) -> Dict[str, Any]:
    page = base_repo.getPageById(idPage)
    return home_repository.update_hero(page=page, data=data)


# ==========================================
# 2. ABOUT SECTION
# ==========================================

def update_about_section(data: AboutSectionRequestDTO, idPage=None) -> Dict[str, Any]:
    page = base_repo.getPageById(idPage)
    return home_repository.update_about(page=page, data=data)



def create_nav(data: NavSectionRequestDTO, idPage=None):
    page = base_repo.getPageById(idPage)
    return home_repository.create_nav(page=page, data=data)


def add_children_to_nav(children_ids, nav_id, idPage):
    page = base_repo.getPageById(idPage)
    updated_nav = home_repository.add_children_to_nav(page=page, nav_id=nav_id, children_ids=children_ids)
    if not updated_nav:
        raise NotFoundError(message=f"Không tìm thấy Nav (id={nav_id}) để thêm ID con")
    return updated_nav

def delete_children_to_nav(children_ids, nav_id, idPage):
    page = base_repo.getPageById(idPage)
    updated_nav = home_repository.delete_children_to_nav(page=page, nav_id=nav_id, children_id=children_ids)
    if not updated_nav:
        raise NotFoundError(message=f"Không tìm thấy Nav (id={nav_id}) để thêm ID con")
    return updated_nav

def get_nav(nav_id, idPage):
    page = base_repo.getPageById(idPage)
    nav = home_repository.get_nav(page=page, nav_id=nav_id)
    if not nav:
        raise NotFoundError(message=f"Không tìm thấy Nav (id={nav_id})")
    return nav


def get_all_navs(idPage):
    page = base_repo.getPageById(idPage)
    return home_repository.get_all_navs(page=page)


def update_nav(data: NavSectionRequestDTO, nav_id: Optional[int] = None, idPage=None) -> Dict[str, Any]:
    page = base_repo.getPageById(idPage)
    updated_nav = home_repository.update_nav(page=page, nav_id=nav_id, data=data)
    if not updated_nav:
        raise NotFoundError(message=f"Không tìm thấy Nav (id={nav_id}) để cập nhật")
    return updated_nav


# ==========================================
# 4. SUPPORT BANNER SECTION
# ==========================================

def update_support_banner_section(data: SupportBannerRequestDTO, idPage=None) -> Dict[str, Any]:
    page = base_repo.getPageById(idPage)
    return home_repository.update_support_banner(page=page, data=data)
