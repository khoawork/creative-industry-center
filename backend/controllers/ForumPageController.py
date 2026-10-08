from flask import Blueprint, request
from marshmallow import ValidationError

from dto.forum_page_dto import (
    ForumPageRequestDTO,
    ForumPageResponseDTO,
    ForumHeaderDTO,
    ForumHeroDTO,
    ForumPillarsDTO,
    ForumSpeakersDTO,
    ForumAgendaDTO,
    ForumAwardsDTO,
    ForumPartnersDTO,
    ForumRegistrationDTO,
)
from services import forum_page_service
from utils.error import APIException
from utils.json import error_response, success_response

forum_page_api = Blueprint("forum_page_api", __name__, url_prefix="/forum-page")


# ==========================================
# 1. TOÀN BỘ TRANG DIỄN ĐÀN KINH TẾ KỶ LỤC
# ==========================================

@forum_page_api.route("", methods=["GET"])
@forum_page_api.route("/<int:page_id>", methods=["GET"])
def get_forum_page(page_id=None):
    """Lấy thông tin cấu hình trang Diễn đàn Kinh tế Kỷ lục"""
    try:
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        page_data = forum_page_service.get_forum_page(page_id)
        result = ForumPageResponseDTO().dump(page_data)
        return success_response(
            data=result,
            message="Lấy dữ liệu trang Diễn đàn Kinh tế Kỷ lục thành công",
            status_code=200,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi lấy dữ liệu trang Diễn đàn Kinh tế Kỷ lục",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("", methods=["PUT"])
@forum_page_api.route("/<int:page_id>", methods=["PUT"])
def update_forum_page(page_id=None):
    """Cập nhật toàn bộ trang Diễn đàn Kinh tế Kỷ lục"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")

        data = ForumPageRequestDTO().load(json_data)
        response = forum_page_service.update_forum_page(page_id, data)
        result = ForumPageResponseDTO().dump(response)
        return success_response(
            data=result,
            message="Cập nhật trang Diễn đàn Kinh tế Kỷ lục thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật trang Diễn đàn Kinh tế Kỷ lục",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 2. CẬP NHẬT CÁC PHẦN (SECTIONS) CỦA DIỄN ĐÀN
# ==========================================

@forum_page_api.route("/header", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/header", methods=["PUT"])
def update_header(page_id=None):
    """Cập nhật phần Header của Diễn đàn"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumHeaderDTO().load(json_data)
        updated = forum_page_service.update_header_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật phần Header Diễn đàn thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật phần Header Diễn đàn",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/hero", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/hero", methods=["PUT"])
def update_hero(page_id=None):
    """Cập nhật phần Hero Banner của Diễn đàn"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumHeroDTO().load(json_data)
        updated = forum_page_service.update_hero_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật phần Hero Diễn đàn thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật phần Hero Diễn đàn",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/pillars", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/pillars", methods=["PUT"])
def update_pillars(page_id=None):
    """Cập nhật 4 Trụ Cột Chiến Lược"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumPillarsDTO().load(json_data)
        updated = forum_page_service.update_pillars_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật 4 Trụ Cột Diễn đàn thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật 4 Trụ Cột Diễn đàn",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/speakers", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/speakers", methods=["PUT"])
def update_speakers(page_id=None):
    """Cập nhật Hội đồng Diễn giả"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumSpeakersDTO().load(json_data)
        updated = forum_page_service.update_speakers_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật Hội đồng Diễn giả thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật Hội đồng Diễn giả",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/agenda", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/agenda", methods=["PUT"])
def update_agenda(page_id=None):
    """Cập nhật Lịch trình Nghị sự / Các phiên làm việc"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumAgendaDTO().load(json_data)
        updated = forum_page_service.update_agenda_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật Chương trình Nghị sự thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật Chương trình Nghị sự",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/awards", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/awards", methods=["PUT"])
def update_awards(page_id=None):
    """Cập nhật Giải thưởng hiển thị trong Diễn đàn"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumAwardsDTO().load(json_data)
        updated = forum_page_service.update_awards_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật Giải thưởng Diễn đàn thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật Giải thưởng Diễn đàn",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/partners", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/partners", methods=["PUT"])
def update_partners(page_id=None):
    """Cập nhật Đơn vị Tổ chức & Nhà tài trợ"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumPartnersDTO().load(json_data)
        updated = forum_page_service.update_partners_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật Đơn vị Đối tác thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật Đơn vị Đối tác",
            details=str(e),
            status_code=500,
        )


@forum_page_api.route("/registration", methods=["PUT"])
@forum_page_api.route("/<int:page_id>/registration", methods=["PUT"])
def update_registration(page_id=None):
    """Cập nhật Thông tin Đăng ký & Liên hệ"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        data = ForumRegistrationDTO().load(json_data)
        updated = forum_page_service.update_registration_section(data, page_id)
        return success_response(
            data=updated,
            message="Cập nhật Thông tin Đăng ký thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except APIException as e:
        return error_response(
            message=e.message,
            status_code=e.status_code,
            error_code=e.error_code,
            details=e.details,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật Thông tin Đăng ký",
            details=str(e),
            status_code=500,
        )

