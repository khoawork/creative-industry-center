from flask import Blueprint, request
from utils.json import success_response, error_response
from utils.auth_decorators import token_required, roles_required
from models.UserModel import RoleEnum
from services import audit_service

activity_api = Blueprint("activity_api", __name__, url_prefix="/activities")


@activity_api.route("/", methods=["GET"])
@token_required
@roles_required(RoleEnum.ADMIN.value, RoleEnum.MANAGER.value)
def get_activities():
    """
    Lấy danh sách nhật ký hoạt động (Admin & Manager)
    """
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 30, type=int)
    module = request.args.get("module", None, type=str)
    action = request.args.get("action", None, type=str)

    data = audit_service.get_activities(
        page=page,
        limit=limit,
        module=module,
        action=action
    )

    return success_response(
        data=data,
        message="Lấy danh sách nhật ký hoạt động thành công",
        status_code=200
    )

