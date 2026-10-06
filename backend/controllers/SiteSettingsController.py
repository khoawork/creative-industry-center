from flask import Blueprint, request
from dto.site_settings_dto import (
    SiteSettingsRequestDTO,
    SiteSettingsResponseDTO,
)
from services import site_settings_service
from utils.json import success_response, error_response

site_api = Blueprint("site_api", __name__, url_prefix="/site-settings")


@site_api.route("", methods=["GET"])
@site_api.route("/", methods=["GET"])
def get_settings():
    """Lấy thông tin cấu hình website (Logo, Tên công ty, Tagline, Footer)."""
    settings = site_settings_service.get_site_settings()
    data = SiteSettingsResponseDTO().dump(settings)
    return success_response(
        data=data,
        message="Lấy thông tin cài đặt website thành công",
        status_code=200
    )


@site_api.route("", methods=["PUT"])
@site_api.route("/", methods=["PUT"])
def update_settings():
    """Cập nhật thông tin cấu hình website (Logo, Tên công ty, Tagline, Footer JSON)."""
    json_data = request.get_json() or {}
    validated_data = SiteSettingsRequestDTO().load(json_data)
    updated = site_settings_service.update_site_settings(validated_data)
    data = SiteSettingsResponseDTO().dump(updated)
    return success_response(
        data=data,
        message="Cập nhật cài đặt website thành công",
        status_code=200
    )


@site_api.route("/upload-logo", methods=["POST"])
def upload_logo():
    """Tải lên file ảnh logo website."""
    if "logo" in request.files:
        file = request.files["logo"]
    elif "file" in request.files:
        file = request.files["file"]
    elif "image" in request.files:
        file = request.files["image"]
    else:
        return error_response(message="Vui lòng đính kèm file ảnh logo.", status_code=400)

    url = site_settings_service.upload_site_logo(file)
    return success_response(
        data={"url": url},
        message="Tải lên ảnh logo thành công",
        status_code=200
    )

