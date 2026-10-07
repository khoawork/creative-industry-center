from functools import wraps
from flask import request, g
from utils.json import error_response
from utils.jwt_util import decode_token
from models.UserModel import User, RoleEnum


def token_required(f):
    """
    Decorator kiểm tra JWT token hợp lệ từ:
    1. HttpOnly Cookie: 'admin_token'
    2. Header: 'Authorization: Bearer <token>'
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # 1. Thử lấy từ Cookie
        if "admin_token" in request.cookies:
            token = request.cookies.get("admin_token")

        # 2. Thử lấy từ Header Authorization
        if not token and "Authorization" in request.headers:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()

        if not token:
            return error_response(
                message="Phiên đăng nhập không tồn tại hoặc đã hết hạn. Vui lòng đăng nhập lại.",
                status_code=401,
                error_code="UNAUTHORIZED"
            )

        payload = decode_token(token)
        if not payload:
            return error_response(
                message="Mã xác thực không hợp lệ hoặc đã hết hạn.",
                status_code=401,
                error_code="TOKEN_EXPIRED"
            )

        user_id = payload.get("sub")
        try:
            user = User.query.get(int(user_id))
        except (ValueError, TypeError):
            user = None
        if not user:
            return error_response(
                message="Tài khoản không tồn tại trên hệ thống.",
                status_code=401,
                error_code="USER_NOT_FOUND"
            )

        # Kiểm tra trạng thái tài khoản
        if not user.is_active:
            return error_response(
                message="Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên tối cao.",
                status_code=403,
                error_code="ACCOUNT_LOCKED"
            )

        # Kiểm tra quyền truy cập vào Admin Panel
        if not user.can_admin_access:
            return error_response(
                message="Tài khoản của bạn đã bị tắt quyền truy cập vào khu vực Quản trị.",
                status_code=403,
                error_code="ADMIN_ACCESS_REVOKED"
            )

        # Gán thông tin user vào context request của Flask
        g.current_user = user
        return f(*args, **kwargs)

    return decorated


def roles_required(*allowed_roles):
    """
    Decorator kiểm tra xem user hiện tại có thuộc danh sách roles được phép hay không.
    Ví dụ: @roles_required(RoleEnum.SUPER_ADMIN.value)
    """
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, **kwargs):
            current_user = getattr(g, "current_user", None)
            if not current_user:
                return error_response(
                    message="Yêu cầu xác thực tài khoản.",
                    status_code=401,
                    error_code="UNAUTHORIZED"
                )

            # ADMIN luôn có toàn quyền tối cao
            if current_user.role == RoleEnum.ADMIN.value:
                return f(*args, **kwargs)

            # Kiểm tra role cụ thể
            if current_user.role not in allowed_roles:
                return error_response(
                    message="Bạn không có quyền thực hiện thao tác này. Quyền này chỉ dành cho cấp quản trị cao hơn.",
                    status_code=403,
                    error_code="FORBIDDEN"
                )

            return f(*args, **kwargs)

        return decorated
    return decorator
