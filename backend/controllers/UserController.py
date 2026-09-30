from flask import Blueprint, request

user_api = Blueprint("user_api", __name__, url_prefix="/user")


@user_api.route("/", methods=["GET"])
def getUser():
    """
    Lấy danh sách người dùng
    ---
    tags:
      - User Management
    responses:
      200:
        description: Thành công
        schema:
          type: string
          example: hello
    """
    return {
        "hi": 1,
        "hêllo": 2
    }