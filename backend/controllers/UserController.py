from flask import Blueprint, request, g
from utils.json import success_response, error_response
from utils.auth_decorators import token_required, roles_required
from models.UserModel import RoleEnum
from services import user_service
from utils.error import AppError

user_api = Blueprint("user_api", __name__, url_prefix="/users")


@user_api.route("/", methods=["GET"])
@token_required
@roles_required(RoleEnum.ADMIN.value, RoleEnum.MANAGER.value)
def get_all_users():
    """
    Lấy danh sách tài khoản (ADMIN và MANAGER)
    """
    users = user_service.get_all_users()
    return success_response(
        data=users,
        message="Lấy danh sách tài khoản thành công",
        status_code=200
    )


@user_api.route("/", methods=["POST"])
@token_required
@roles_required(RoleEnum.ADMIN.value)
def create_user():
    """
    Tạo tài khoản mới (CHỈ DUY NHẤT ADMIN)
    """
    try:
        data = request.get_json() or {}
        new_user = user_service.create_user(data, creator=g.current_user)
        return success_response(
            data=new_user,
            message=f"Tạo tài khoản '{new_user['username']}' thành công!",
            status_code=201
        )
    except AppError as e:
        return error_response(message=e.message, status_code=e.status_code, error_code=e.error_code)


@user_api.route("/<int:user_id>", methods=["PUT"])
@token_required
def update_user(user_id: int):
    """
    Cập nhật thông tin tài khoản (ADMIN hoặc chính chủ)
    """
    try:
        data = request.get_json() or {}
        updated = user_service.update_user(user_id, data, current_user=g.current_user)
        return success_response(
            data=updated,
            message=f"Cập nhật tài khoản '{updated['username']}' thành công!",
            status_code=200
        )
    except AppError as e:
        return error_response(message=e.message, status_code=e.status_code, error_code=e.error_code)


@user_api.route("/<int:user_id>/toggle-admin-access", methods=["PATCH"])
@token_required
@roles_required(RoleEnum.ADMIN.value)
def toggle_admin_access(user_id: int):
    """
    Bật / Tắt quyền truy cập admin của một tài khoản (CHỈ DUY NHẤT ADMIN)
    """
    try:
        updated = user_service.toggle_admin_access(user_id, current_user=g.current_user)
        status_str = "kích hoạt" if updated["can_admin_access"] else "vô hiệu hóa"
        return success_response(
            data=updated,
            message=f"Đã {status_str} quyền truy cập Admin cho tài khoản '{updated['username']}'.",
            status_code=200
        )
    except AppError as e:
        return error_response(message=e.message, status_code=e.status_code, error_code=e.error_code)