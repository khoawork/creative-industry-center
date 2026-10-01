from typing import Dict, Any, List
from repositories import base_repo
from utils.error import NotFoundError, ConflictError
from models.PageModel import Page


def _serialize_page(page: Page) -> Dict[str, Any]:
    """Helper chuyển đổi Page model sang dict để dump qua DTO"""
    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": page.props or {},
        "created_date": page.created_date.isoformat() if hasattr(page, "created_date") and page.created_date else None,
        "updated_date": page.updated_date.isoformat() if hasattr(page, "updated_date") and page.updated_date else None,
    }


def create_page(data) -> Dict[str, Any]:
    """
    Tạo một Page mới (đồng thời là 1 item trên header).
    Kiểm tra trùng lặp slug trước khi tạo.
    """
    slug = (getattr(data, "slug", "") or "").strip().strip("/")
    if not slug:
        raise ConflictError(message="Đường dẫn (slug) không được để trống")

    existing_page = base_repo.getPageBySlug(slug)
    if existing_page:
        raise ConflictError(message=f"Trang với đường dẫn (slug) '{slug}' đã tồn tại")

    props = getattr(data, "props", None) or {}
    name = (getattr(data, "name", "") or "").strip()
    new_page = base_repo.createPage(
        name=name,
        slug=slug,
        props=props
    )
    return _serialize_page(new_page)


def get_all_pages() -> List[Dict[str, Any]]:
    """Lấy danh sách tất cả các trang đầy đủ"""
    pages = base_repo.getAllPages()
    return [_serialize_page(p) for p in pages]


def get_header_items() -> List[Dict[str, Any]]:
    """Lấy danh sách các trang rút gọn (id, name, slug) phục vụ riêng cho Menu Header"""
    pages = base_repo.getAllPages()
    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug
        }
        for p in pages
    ]


def get_page_by_id(page_id: int) -> Dict[str, Any]:
    """Lấy chi tiết trang theo ID"""
    page = base_repo.getPageById(page_id)
    if not page:
        raise NotFoundError(message=f"Không tìm thấy trang với ID {page_id}")
    return _serialize_page(page)


def get_page_by_slug(slug: str) -> Dict[str, Any]:
    """Lấy chi tiết trang theo slug (ví dụ: home, events, trainings,...)"""
    normalized_slug = (slug or "").strip().strip("/")
    page = base_repo.getPageBySlug(normalized_slug)
    if not page:
        raise NotFoundError(message=f"Không tìm thấy trang với đường dẫn '{slug}'")
    return _serialize_page(page)


def update_page(page_id: int, data) -> Dict[str, Any]:
    """Cập nhật thông tin trang"""
    page = base_repo.getPageById(page_id)
    if not page:
        raise NotFoundError(message=f"Không tìm thấy trang với ID {page_id} để cập nhật")

    name = getattr(data, "name", None)
    if name is not None:
        name = name.strip()

    slug = getattr(data, "slug", None)
    if slug is not None:
        slug = slug.strip().strip("/")
        if not slug:
            raise ConflictError(message="Đường dẫn (slug) không được để trống")
        if slug != page.slug:
            existing = base_repo.getPageBySlug(slug)
            if existing and existing.id != page_id:
                raise ConflictError(message=f"Đường dẫn (slug) '{slug}' đã được sử dụng bởi trang khác")

    props = getattr(data, "props", None)

    updated = base_repo.updatePage(page=page, name=name, slug=slug, props=props)
    return _serialize_page(updated)


def delete_page(page_id: int) -> bool:
    page = base_repo.getPageById(page_id)
    if not page:
        raise NotFoundError(message=f"Không tìm thấy trang với ID {page_id} để xóa")
    return base_repo.deletePage(page)
