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
        "is_visible": bool(page.is_visible) if hasattr(page, "is_visible") and page.is_visible is not None else True,
        "order_index": int(page.order_index) if hasattr(page, "order_index") and page.order_index is not None else 0,
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
    """Lấy danh sách các trang rút gọn (id, name, slug) phục vụ riêng cho Menu Header (chỉ lấy trang đang hiển thị)"""
    pages = base_repo.getAllPages()
    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "is_visible": bool(p.is_visible) if hasattr(p, "is_visible") and p.is_visible is not None else True,
            "order_index": int(p.order_index) if hasattr(p, "order_index") and p.order_index is not None else 0
        }
        for p in pages
        if getattr(p, "is_visible", True) is not False
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
    """Cập nhật thông tin trang: chỉ cho phép sửa tên trang và trạng thái ẩn/hiện, không cho đổi slug"""
    from services import audit_service

    page = base_repo.getPageById(page_id)
    if not page:
        raise NotFoundError(message=f"Không tìm thấy trang với ID {page_id} để cập nhật")

    old_name = page.name
    old_visible = page.is_visible

    name = getattr(data, "name", None)
    if name is not None:
        name = name.strip()

    is_visible = getattr(data, "is_visible", None)
    props = getattr(data, "props", None)

    # KHÔNG cho phép chỉnh sửa slug (giữ nguyên slug hệ thống)
    updated = base_repo.updatePage(page=page, name=name, slug=None, props=props, is_visible=is_visible)

    # Ghi nhận Nhật ký
    changes = {}
    summaries = []
    if name is not None and name != old_name:
        changes["name"] = {"old": old_name, "new": name}
        summaries.append(f"Đã đổi tên trang từ '{old_name}' thành '{name}'")
    if is_visible is not None and is_visible != old_visible:
        status_text = "hiển thị" if is_visible else "ẩn"
        changes["is_visible"] = {"old": old_visible, "new": is_visible}
        summaries.append(f"Đã chuyển trang '{updated.name}' sang trạng thái {status_text} trên Menu")

    if summaries:
        audit_service.log_activity(
            action="UPDATE",
            module="Menu & Điều hướng",
            summary="; ".join(summaries),
            target_id=page_id,
            changes=changes
        )

    return _serialize_page(updated)


def delete_page(page_id: int) -> bool:
    """Chặn xóa trang: Hệ thống không cho phép xóa, chỉ cho phép ẩn trang"""
    raise ConflictError(message="Hệ thống không cho phép xóa trang. Bạn vui lòng sử dụng chức năng 'Ẩn trang khỏi Menu'.")


def reorder_pages(orders: List[Any]) -> List[Dict[str, Any]]:
    """Cập nhật thứ tự hiển thị của các trang navigation"""
    from services import audit_service

    clean_orders: List[Dict[str, Any]] = []
    for item in orders:
        if isinstance(item, dict):
            pid = item.get("id")
            idx = item.get("order_index")
        else:
            pid = getattr(item, "id", None)
            idx = getattr(item, "order_index", None)
        if pid is not None and idx is not None:
            clean_orders.append({"id": int(pid), "order_index": int(idx)})

    updated_pages = base_repo.reorderPages(clean_orders)

    # Ghi nhận nhật ký đổi thứ tự
    audit_service.log_activity(
        action="REORDER",
        module="Menu & Điều hướng",
        summary=f"Đã sắp xếp lại thứ tự {len(clean_orders)} mục trên Menu điều hướng",
        changes={"orders": clean_orders}
    )

    return [_serialize_page(p) for p in updated_pages]


