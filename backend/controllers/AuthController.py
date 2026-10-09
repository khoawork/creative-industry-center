from datetime import datetime
from flask import Blueprint, request, make_response, g
from extensions import db
from models.UserModel import User, RoleEnum
from utils.json import success_response, error_response
from utils.jwt_util import (
    generate_access_token,
    generate_refresh_token,
    verify_token,
    ACCESS_TOKEN_EXPIRATION_SECONDS,
    REFRESH_TOKEN_EXPIRATION_SECONDS,
)
from utils.cookie_crypto import seal_cookie_token, unseal_cookie_token, hash_token
from utils.auth_decorators import token_required

auth_api = Blueprint("auth_api", __name__, url_prefix="/auth")


@auth_api.route("/login", methods=["POST"])
def login():
    """
    Đăng nhập quản trị viên:
    - Sinh Access Token (ngắn hạn) và Refresh Token (dài hạn).
    - Lưu hash SHA-256 của Refresh Token vào database.
    - Mã hóa và băm ký (seal/hash) token trước khi set vào HttpOnly Cookies.
    """
    data = request.get_json() or {}
    username_or_email = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    from services import user_service
    from utils.error import AppError

    try:
        user = user_service.authenticate_user(username_or_email, password)
    except AppError as e:
        return error_response(
            message=e.message, status_code=e.status_code, error_code=e.error_code
        )

    # Sinh cặp Access Token và Refresh Token
    access_token = generate_access_token(user, expires_in=ACCESS_TOKEN_EXPIRATION_SECONDS)
    refresh_token = generate_refresh_token(user, expires_in=REFRESH_TOKEN_EXPIRATION_SECONDS)

    # Lưu SHA-256 hash của refresh token và cập nhật thời gian đăng nhập
    user.refresh_token_hash = hash_token(refresh_token)
    user.last_login_at = datetime.utcnow()
    db.session.commit()

    # Mã hóa (seal/hash) token trước khi lưu vào Cookies
    sealed_access_token = seal_cookie_token(access_token)
    sealed_refresh_token = seal_cookie_token(refresh_token)

    user_data = user.to_dict()
    response_payload = {
        "success": True,
        "message": f"Chào mừng {user.full_name or user.username} đăng nhập thành công!",
        "data": {
            "token": access_token,
            "refresh_token": refresh_token,
            "user": user_data,
        },
    }

    resp = make_response(response_payload, 200)

    # Set Cookie admin_token (Access token đã được mã hóa/hash)
    resp.set_cookie(
        key="admin_token",
        value=sealed_access_token,
        max_age=REFRESH_TOKEN_EXPIRATION_SECONDS,
        httponly=True,
        samesite="Lax",
        secure=False,  # Đặt False khi test localhost HTTP, chuyển True khi dùng HTTPS
        path="/",
    )

    # Set Cookie admin_refresh_token (Refresh token đã được mã hóa/hash)
    resp.set_cookie(
        key="admin_refresh_token",
        value=sealed_refresh_token,
        max_age=REFRESH_TOKEN_EXPIRATION_SECONDS,
        httponly=True,
        samesite="Lax",
        secure=False,
        path="/",
    )

    return resp


@auth_api.route("/refresh", methods=["POST"])
def refresh():
    """
    Làm mới phiên làm việc:
    - Nhận Refresh Token từ HttpOnly Cookie (đã mã hóa) hoặc request body.
    - Kiểm tra hạn và tính toàn vẹn qua JWT claim và hash trong database.
    - Cấp Access Token mới và xoay vòng Refresh Token (Token Rotation).
    """
    refresh_token = None

    # 1. Thử lấy từ HttpOnly Cookie 'admin_refresh_token'
    if "admin_refresh_token" in request.cookies:
        raw_cookie = request.cookies.get("admin_refresh_token")
        refresh_token = unseal_cookie_token(raw_cookie)

    # 2. Thử lấy từ request body nếu cookie không khả dụng
    if not refresh_token:
        body_data = request.get_json(silent=True) or {}
        raw_body_token = body_data.get("refresh_token")
        if raw_body_token:
            refresh_token = unseal_cookie_token(raw_body_token) or raw_body_token

    if not refresh_token:
        return error_response(
            message="Không tìm thấy Refresh Token. Vui lòng đăng nhập lại.",
            status_code=401,
            error_code="REFRESH_TOKEN_MISSING",
        )

    # Xác thực tính hợp lệ của Refresh Token
    payload, error_code = verify_token(refresh_token, expected_type="refresh")
    if error_code == "TOKEN_EXPIRED":
        return error_response(
            message="Phiên làm việc đã hết hạn hoàn toàn. Vui lòng đăng nhập lại.",
            status_code=401,
            error_code="REFRESH_TOKEN_EXPIRED",
        )
    elif not payload or error_code:
        return error_response(
            message="Mã làm mới không hợp lệ. Vui lòng đăng nhập lại.",
            status_code=401,
            error_code="INVALID_REFRESH_TOKEN",
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

    if not user.is_active:
        return error_response(
            message="Tài khoản của bạn đã bị khóa.",
            status_code=403,
            error_code="ACCOUNT_LOCKED",
        )

    if not user.can_admin_access:
        return error_response(
            message="Tài khoản của bạn đã bị tắt quyền quản trị.",
            status_code=403,
            error_code="ADMIN_ACCESS_REVOKED",
        )

    # So khớp SHA-256 hash của refresh token với database để ngăn chặn tái sử dụng token
    token_hash = hash_token(refresh_token)
    if not user.refresh_token_hash or user.refresh_token_hash != token_hash:
        # Phát hiện token không khớp (có thể đã bị thu hồi hoặc nghi vấn đánh cắp)
        user.refresh_token_hash = None
        db.session.commit()
        return error_response(
            message="Phiên làm việc đã bị thu hồi hoặc sử dụng ở thiết bị khác. Vui lòng đăng nhập lại.",
            status_code=401,
            error_code="REFRESH_TOKEN_REVOKED",
        )

    # Sinh cặp Token mới (Refresh Token Rotation)
    new_access_token = generate_access_token(user, expires_in=ACCESS_TOKEN_EXPIRATION_SECONDS)
    new_refresh_token = generate_refresh_token(user, expires_in=REFRESH_TOKEN_EXPIRATION_SECONDS)

    # Cập nhật hash mới vào database
    user.refresh_token_hash = hash_token(new_refresh_token)
    db.session.commit()

    # Mã hóa (seal/hash) trước khi set vào cookies
    sealed_access = seal_cookie_token(new_access_token)
    sealed_refresh = seal_cookie_token(new_refresh_token)

    response_payload = {
        "success": True,
        "message": "Làm mới mã truy cập thành công",
        "data": {
            "token": new_access_token,
            "refresh_token": new_refresh_token,
            "user": user.to_dict(),
        },
    }

    resp = make_response(response_payload, 200)

    # Cập nhật lại cả hai Cookie
    resp.set_cookie(
        key="admin_token",
        value=sealed_access,
        max_age=REFRESH_TOKEN_EXPIRATION_SECONDS,
        httponly=True,
        samesite="Lax",
        secure=False,
        path="/",
    )
    resp.set_cookie(
        key="admin_refresh_token",
        value=sealed_refresh,
        max_age=REFRESH_TOKEN_EXPIRATION_SECONDS,
        httponly=True,
        samesite="Lax",
        secure=False,
        path="/",
    )

    return resp


@auth_api.route("/logout", methods=["POST"])
def logout():
    """
    Đăng xuất:
    - Thu hồi hash refresh token trong database.
    - Xóa toàn bộ cookies xác thực.
    """
    # Nếu có token hợp lệ, thu hồi refresh token hash
    try:
        token = None
        if "admin_token" in request.cookies:
            token = unseal_cookie_token(request.cookies.get("admin_token"))
        elif "Authorization" in request.headers:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()

        if token:
            payload, _ = verify_token(token)
            if payload and "sub" in payload:
                user = User.query.get(int(payload["sub"]))
                if user:
                    user.refresh_token_hash = None
                    db.session.commit()
    except Exception:
        pass

    response_payload = {
        "success": True,
        "message": "Đã đăng xuất thành công.",
        "data": None,
    }
    resp = make_response(response_payload, 200)
    resp.delete_cookie("admin_token", path="/")
    resp.delete_cookie("admin_refresh_token", path="/")
    return resp


@auth_api.route("/me", methods=["GET"])
@token_required
def get_current_user_profile():
    """
    Lấy thông tin tài khoản hiện tại từ phiên đăng nhập
    """
    user = g.current_user
    return success_response(
        data=user.to_dict(),
        message="Lấy thông tin tài khoản thành công",
        status_code=200,
    )
