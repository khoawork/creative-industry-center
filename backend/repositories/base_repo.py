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
    """Lấy danh sách tất cả các trang (các mục header) theo thứ tự order_index"""
    return Page.query.order_by(Page.order_index.asc(), Page.id.asc()).all()


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


def updatePage(page: Page, name: Optional[str] = None, slug: Optional[str] = None, props: Optional[dict] = None, is_visible: Optional[bool] = None, order_index: Optional[int] = None) -> Page:
    """Cập nhật thông tin của Page"""
    if name is not None:
        page.name = name
    if slug is not None:
        page.slug = slug
    if props is not None:
        page.props = _to_dict(props)
        flag_modified(page, "props")
    if is_visible is not None:
        page.is_visible = bool(is_visible)
    if order_index is not None:
        page.order_index = int(order_index)
    db.session.commit()
    return page


def reorderPages(orders: List[Any]) -> List[Page]:
    """Cập nhật thứ tự order_index cho danh sách page theo [{id, order_index}]"""
    for item in orders:
        if isinstance(item, dict):
            page_id = item.get("id")
            new_order = item.get("order_index")
        else:
            page_id = getattr(item, "id", None)
            new_order = getattr(item, "order_index", None)

        if page_id is not None and new_order is not None:
            page = Page.query.filter_by(id=page_id).first()
            if page:
                page.order_index = int(new_order)
    db.session.commit()
    return getAllPages()


def deletePage(page: Page) -> bool:
    """Xóa Page khỏi database"""
    db.session.delete(page)
    db.session.commit()
    return True