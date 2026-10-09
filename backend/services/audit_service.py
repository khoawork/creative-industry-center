import logging
from typing import Optional, Dict, Any
from flask import g
from repositories import activity_log_repo
from dto.activity_log_dto import ActivityLogResponseDTO

from types import SimpleNamespace

logger = logging.getLogger(__name__)


def _to_serializable(obj: Any) -> Any:
    if isinstance(obj, SimpleNamespace):
        return {k: _to_serializable(v) for k, v in vars(obj).items()}
    if isinstance(obj, dict):
        return {k: _to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple, set)):
        return [_to_serializable(x) for x in obj]
    return obj


def log_activity(
    action: str,
    module: str,
    summary: str,
    target_id: Optional[int] = None,
    changes: Optional[Dict[str, Any]] = None,
    user: Optional[Any] = None
) -> None:
    """
    Helper ghi nhận nhật ký thao tác dữ liệu.
    Tự động nhận diện current_user trong context request nếu không truyền user.
    """
    try:
        current = user or getattr(g, "current_user", None)
        if current:
            user_id = current.id
            user_name = getattr(current, "full_name", None) or getattr(current, "username", "Admin")
            user_role = getattr(current, "role", "admin")
        else:
            user_id = None
            user_name = "Quản trị viên"
            user_role = "admin"

        safe_changes = _to_serializable(changes) if changes is not None else None

        activity_log_repo.create_activity_log(
            user_id=user_id,
            user_name=user_name,
            user_role=user_role,
            action=action,
            module=module,
            summary=summary,
            target_id=target_id,
            changes=safe_changes
        )
        # Đánh dấu request này đã được ghi log thành công
        setattr(g, "_activity_logged", True)
    except Exception as e:
        logger.error(f"Lỗi khi ghi nhật ký hoạt động: {e}", exc_info=True)


def auto_log_request(req, res) -> None:
    """
    Tự động ghi nhận log cho mọi thao tác chỉnh sửa dữ liệu trên Admin Dashboard
    khi request thành công (200, 201, 204).
    """
    if req.method not in ["POST", "PUT", "PATCH", "DELETE"]:
        return
    if res.status_code not in [200, 201, 204]:
        return
    if getattr(g, "_activity_logged", False):
        return

    path = req.path.lower()

    # Bỏ qua các endpoint không phải thao tác quản trị nội dung
    skip_prefixes = [
        "/auth/login",
        "/auth/logout",
        "/auth/me",
        "/activities",
        "/forms/submit",  # Form submit của khách ngoài web
    ]
    if any(path.startswith(prefix) for prefix in skip_prefixes):
        return

    # Lấy thông tin user đăng nhập từ context hoặc JWT
    current_user = getattr(g, "current_user", None)
    if not current_user:
        token = req.cookies.get("admin_token")
        if not token and "Authorization" in req.headers:
            auth_header = req.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()
        if token:
            from utils.jwt_util import decode_token
            from models.UserModel import User
            payload = decode_token(token)
            if payload and "sub" in payload:
                try:
                    current_user = User.query.get(int(payload["sub"]))
                except Exception:
                    current_user = None

    if not current_user:
        return

    # Phân loại Khu vực (Module)
    module = "Nội dung website"
    if "/page" in path or "/navigation" in path:
        module = "Menu & Điều hướng"
    elif "/home" in path:
        module = "Trang chủ"
    elif "/introduce" in path or "/about" in path:
        module = "Giới thiệu"
    elif "/event" in path:
        module = "Sự kiện"
    elif "/project" in path:
        module = "Dự án"
    elif "/training" in path:
        module = "Đào tạo"
    elif "/award" in path:
        module = "Giải thưởng"
    elif "/record" in path:
        module = "Kỷ lục"
    elif "/founder" in path:
        module = "Nhà sáng lập"
    elif "/site" in path or "/logo" in path:
        module = "Logo & Footer"
    elif "/form" in path:
        module = "Quản lý Biểu mẫu"
    elif "/user" in path:
        module = "Tài khoản"
    elif "/catalog" in path:
        module = "Danh mục dữ liệu"

    # Phân loại Hành động (Action)
    if req.method == "POST":
        action = "CREATE"
        action_verb = "Đã thêm mới"
    elif req.method in ["PUT", "PATCH"]:
        action = "UPDATE"
        action_verb = "Đã cập nhật"
    elif req.method == "DELETE":
        action = "DELETE"
        action_verb = "Đã xóa"
    else:
        action = "UPDATE"
        action_verb = "Đã chỉnh sửa"

    # Chi tiết thao tác tiếng Việt
    sub_detail = ""
    if "hero" in path:
        sub_detail = "phần Hero banner"
    elif "overview" in path:
        sub_detail = "phần Tổng quan"
    elif "vision" in path:
        sub_detail = "Tầm nhìn"
    elif "mission" in path:
        sub_detail = "Sứ mệnh"
    elif "core-values" in path:
        sub_detail = "Giá trị cốt lõi"
    elif "actions" in path:
        sub_detail = "Định hướng hành động"
    elif "nav" in path:
        sub_detail = "mục Menu điều hướng"
    elif "categories" in path or "category" in path:
        sub_detail = "danh mục"
    elif "filter" in path:
        sub_detail = "bộ lọc hiển thị"
    elif "newsletter" in path:
        sub_detail = "cấu hình Bản tin"
    elif "displayed-events" in path:
        sub_detail = "danh sách sự kiện hiển thị"
    elif "selected-projects" in path:
        sub_detail = "danh sách dự án tiêu biểu"
    elif "models" in path:
        sub_detail = "mô hình đào tạo"
    elif "certification" in path:
        sub_detail = "chứng chỉ đào tạo"
    elif "proposal" in path:
        sub_detail = "đề xuất chương trình"
    elif "upload-logo" in path or "logo" in path:
        sub_detail = "Logo website"
    elif "config" in path:
        sub_detail = "cấu hình biểu mẫu"
    elif "sections" in path:
        sub_detail = "các phần nội dung"
    elif "cta" in path:
        sub_detail = "nút kêu gọi hành động (CTA)"

    if sub_detail:
        summary = f"{action_verb} {sub_detail} tại mục {module}"
    else:
        summary = f"{action_verb} nội dung tại mục {module}"

    # Lấy thông tin payload thay đổi an toàn
    changes = None
    try:
        body = req.get_json(silent=True)
        if body and isinstance(body, dict):
            changes = {}
            for k, v in body.items():
                if k in ["password", "token", "secret"]:
                    changes[k] = "******"
                elif isinstance(v, (str, int, float, bool)) or v is None:
                    changes[k] = v
                elif isinstance(v, (list, dict)):
                    changes[k] = f"[{len(v)} mục]" if isinstance(v, list) else "{...}"
    except Exception:
        changes = None

    log_activity(
        action=action,
        module=module,
        summary=summary,
        changes=changes,
        user=current_user
    )


def get_activities(
    page: int = 1,
    limit: int = 50,
    module: Optional[str] = None,
    action: Optional[str] = None,
    user_id: Optional[int] = None
) -> Dict[str, Any]:
    """Lấy danh sách nhật ký có phân trang"""
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 50

    offset = (page - 1) * limit
    logs, total = activity_log_repo.get_activity_logs(
        limit=limit,
        offset=offset,
        module=module,
        action=action,
        user_id=user_id
    )

    schema = ActivityLogResponseDTO()
    items = [schema.dump(log.to_dict()) for log in logs]
    total_pages = (total + limit - 1) // limit if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }
