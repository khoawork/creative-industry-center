from functools import wraps
from flask import request, g
from utils.json import error_response
from utils.jwt_util import verify_token
from utils.cookie_crypto import unseal_cookie_token
from models.UserModel import User, RoleEnum


def token_required(f):
    """
    Decorator kiểm tra JWT access token hợp lệ từ:
    1. Header: 'Authorization: Bearer <token>' (ưu tiên khi client chỉ định)
    2. HttpOnly Cookie: 'admin_token' (được unseal từ chuỗi mã hóa/hash)
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # 1. Ưu tiên lấy từ Header Authorization nếu có
        if "Authorization" in request.headers:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                raw_header_val = auth_header.split(" ", 1)[1].strip()
                # Có thể là raw JWT hoặc sealed token
                token = unseal_cookie_token(raw_header_val) or raw_header_val

        # 2. Nếu Header không có, lấy từ Cookie 'admin_token' (đã được seal/mã hóa)
        if not token and "admin_token" in request.cookies:
            raw_cookie_val = request.cookies.get("admin_token")
            token = unseal_cookie_token(raw_cookie_val)

        if not token:
            return error_response(
                message="Phiên đăng nhập không tồn tại. Vui lòng đăng nhập.",
                status_code=401,
                error_code="UNAUTHORIZED",
            )

        # Xác minh Access Token
        payload, error_code = verify_token(token, expected_type="access")
        if error_code == "TOKEN_EXPIRED":
            return error_response(
                message="Phiên làm việc đã hết hạn. Vui lòng làm mới token.",
                status_code=401,
                error_code="TOKEN_EXPIRED",
            )
        elif not payload or error_code:
            return error_response(
                message="Mã xác thực không hợp lệ.",
                status_code=401,
                error_code="INVALID_TOKEN",
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
                error_code="USER_NOT_FOUND",
            )

        # Kiểm tra trạng thái tài khoản
        if not user.is_active:
            return error_response(
                message="Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên tối cao.",
                status_code=403,
                error_code="ACCOUNT_LOCKED",
            )

        # Kiểm tra quyền truy cập vào Admin Panel
        if not user.can_admin_access:
            return error_response(
                message="Tài khoản của bạn đã bị tắt quyền truy cập vào khu vực Quản trị.",
                status_code=403,
                error_code="ADMIN_ACCESS_REVOKED",
            )

        # Gán thông tin user vào context request của Flask
        g.current_user = user
        return f(*args, **kwargs)

    return decorated


def roles_required(*allowed_roles):
    """
    Decorator kiểm tra xem user hiện tại có thuộc danh sách roles được phép hay không.
    Ví dụ: @roles_required(RoleEnum.ADMIN.value)
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
                    error_code="UNAUTHORIZED",
                )

            # ADMIN luôn có toàn quyền tối cao
            if current_user.role == RoleEnum.ADMIN.value:
                return f(*args, **kwargs)

            # Kiểm tra role cụ thể
            if current_user.role not in allowed_roles:
                return error_response(
                    message="Bạn không có quyền thực hiện thao tác này.",
                    status_code=403,
                    error_code="FORBIDDEN",
                )

            return f(*args, **kwargs)

        return decorated
    return decorator
