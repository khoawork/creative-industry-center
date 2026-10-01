from typing import Any, List, Optional
from types import SimpleNamespace
from sqlalchemy.orm.attributes import flag_modified
from extensions import db
from models.PageModel import Page


def _to_dict(obj: Any) -> Any:
    """Chuyển đổi SimpleNamespace hoặc dict sang định dạng dict chuẩn cho JSON"""
    if isinstance(obj, SimpleNamespace):
        return {k: _to_dict(v) for k, v in vars(obj).items()}
    elif isinstance(obj, dict):
        return {k: _to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_to_dict(item) for item in obj]
    return obj


def getPageById(id: int) -> Optional[Page]:
    """Tìm Page theo ID"""
    return Page.query.filter_by(id=id).first()


def getPageBySlug(slug: str = "home") -> Optional[Page]:
    """Tìm Page theo Slug"""
    return Page.query.filter_by(slug=slug).first()


def getAllPages() -> List[Page]:
    """Lấy danh sách tất cả các trang (các mục header)"""
    return Page.query.order_by(Page.id.asc()).all()


def createPage(name: str, slug: str, props: Optional[dict] = None) -> Page:
    """Tạo mới một Page trong database"""
    new_page = Page(
        name=name,
        slug=slug,
        props=_to_dict(props) if props is not None else {}
    )
    db.session.add(new_page)
    db.session.commit()
    return new_page


def updatePage(page: Page, name: Optional[str] = None, slug: Optional[str] = None, props: Optional[dict] = None) -> Page:
    """Cập nhật thông tin của Page"""
    if name is not None:
        page.name = name
    if slug is not None:
        page.slug = slug
    if props is not None:
        page.props = _to_dict(props)
        flag_modified(page, "props")
    db.session.commit()
    return page


def deletePage(page: Page) -> bool:
    """Xóa Page khỏi database"""
    db.session.delete(page)
    db.session.commit()
    return True