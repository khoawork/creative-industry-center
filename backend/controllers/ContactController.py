from flask import Blueprint, request

from dto.contact_dto import ContactPagePropsDTO, ContactPageResponse
from services import contact_service
from utils.json import success_response


contact_api = Blueprint("contact_api", __name__, url_prefix="/contact")


@contact_api.route("", methods=["GET"])
@contact_api.route("/", methods=["GET"])
@contact_api.route("/<int:page_id>", methods=["GET"])
def get_contact(page_id=None):
    page = contact_service.get_contact_page(page_id)
    return success_response(
        data=ContactPageResponse().dump(page),
        message="Lấy dữ liệu trang Liên hệ thành công.",
    )


@contact_api.route("", methods=["PUT"])
@contact_api.route("/", methods=["PUT"])
@contact_api.route("/<int:page_id>", methods=["PUT"])
def update_contact(page_id=None):
    payload = request.get_json() or {}
    props = payload.get("props", payload)
    validated_props = ContactPagePropsDTO().load(props)
    page = contact_service.update_contact_props(validated_props, page_id)
    return success_response(
        data=ContactPageResponse().dump(page),
        message="Đã lưu nội dung trang Liên hệ.",
    )
