from datetime import datetime
from flask import Blueprint, request, make_response, g
from extensions import db
from models.UserModel import User, RoleEnum
from utils.json import success_response, error_response
from utils.jwt_util import generate_token, DEFAULT_EXPIRATION_SECONDS
from utils.auth_decorators import token_required

auth_api = Blueprint("auth_api", __name__, url_prefix="/auth")


@auth_api.route("/login", methods=["POST"])
def login():
    """
    Đăng nhập quản trị viên
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: "admin"
            password:
              type: string
              example: "admin123"
    responses:
      200:
        description: Đăng nhập thành công và set cookie admin_token
      401:
        description: Sai tài khoản hoặc mật khẩu
      403:
        description: Tài khoản bị khóa hoặc tắt quyền admin
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

    # Cập nhật thời gian đăng nhập lần cuối
    now = datetime.utcnow()
    user.last_login_at = now
    db.session.commit()

    # Sinh JWT Token
    token = generate_token(user, expires_in=DEFAULT_EXPIRATION_SECONDS)

    # Tạo response JSON và gán Cookie HttpOnly
    user_data = user.to_dict()
    response_payload = {
        "success": True,
        "message": f"Chào mừng {user.full_name or user.username} đăng nhập thành công!",
        "data": {
            "token": token,
            "user": user_data,
        },
    }

    resp = make_response(response_payload, 200)
    # Set Cookie admin_token: httponly=True, path='/'
    resp.set_cookie(
        key="admin_token",
        value=token,
        max_age=DEFAULT_EXPIRATION_SECONDS,
        httponly=True,
        samesite="Lax",
        secure=False,  # Đặt False khi chạy HTTP localhost, chuyển True nếu trên HTTPS production
        path="/",
    )
    return resp


@auth_api.route("/logout", methods=["POST"])
def logout():
    """
    Đăng xuất: Xóa cookie admin_token
    ---
    tags:
      - Authentication
    responses:
      200:
        description: Đăng xuất thành công
    """
    response_payload = {
        "success": True,
        "message": "Đã đăng xuất thành công.",
        "data": None,
    }
    resp = make_response(response_payload, 200)
    resp.delete_cookie("admin_token", path="/")
    return resp


@auth_api.route("/me", methods=["GET"])
@token_required
def get_current_user_profile():
    """
    Lấy thông tin tài khoản hiện tại từ phiên đăng nhập
    ---
    tags:
      - Authentication
    responses:
      200:
        description: Trả về thông tin user hiện tại
      401:
        description: Chưa đăng nhập hoặc token hết hạn
    """
    user = g.current_user
    return success_response(
        data=user.to_dict(),
        message="Lấy thông tin tài khoản thành công",
        status_code=200,
    )
