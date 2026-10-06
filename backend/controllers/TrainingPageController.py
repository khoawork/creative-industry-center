from flask import Blueprint, request
from marshmallow import ValidationError

from dto.training_page_dto import (
    TrainingPageRequestDTO,
    TrainingPageResponse,
    HeaderSectionRequestDTO,
    HeaderSectionResponse,
    ProposalSectionRequestDTO,
    ProposalSectionResponse,
    SelectedTrainingsRequestDTO,
    SelectedTrainingsResponse,
)
from services import training_page_service
from utils.error import APIException
from utils.json import error_response, success_response

training_page_api = Blueprint("training_page_api", __name__, url_prefix="/training-page")


# ==========================================
# 1. TOÀN BỘ TRANG HỢP TÁC & ĐÀO TẠO
# ==========================================

@training_page_api.route("", methods=["GET"])
@training_page_api.route("/<int:page_id>", methods=["GET"])
def get_training_page(page_id=None):
    """Lấy thông tin cấu hình trang Hợp tác & Đào tạo (Header, Form Đề xuất, Khóa học được chọn)"""
    try:
        if page_id is None:
            page_id = request.args.get("idPage", type=int)
        page_data = training_page_service.get_training_page(page_id)
        result = TrainingPageResponse().dump(page_data)
        return success_response(
            data=result,
            message="Lấy dữ liệu trang Hợp tác & Đào tạo thành công",
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
            message="Lỗi khi lấy dữ liệu trang Hợp tác & Đào tạo",
            details=str(e),
            status_code=500,
        )


@training_page_api.route("", methods=["PUT"])
@training_page_api.route("/<int:page_id>", methods=["PUT"])
def update_training_page(page_id=None):
    """Cập nhật tổng thể trang Hợp tác & Đào tạo"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")

        data = TrainingPageRequestDTO().load(json_data)
        response = training_page_service.update_training_page(page_id, data)
        result = TrainingPageResponse().dump(response)
        return success_response(
            data=result,
            message="Cập nhật trang Hợp tác & Đào tạo thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật trang Hợp tác & Đào tạo",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 2. HEADER SECTION
# ==========================================

@training_page_api.route("/header", methods=["POST", "PUT"])
@training_page_api.route("/header/<int:page_id>", methods=["POST", "PUT"])
def update_header(page_id=None):
    """Cập nhật Header Section (Badge, Tiêu đề, Mô tả, Thống kê) của trang Hợp tác & Đào tạo"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")

        data = HeaderSectionRequestDTO().load(json_data)
        response = training_page_service.update_header_section(data, page_id)
        result = HeaderSectionResponse().dump(response)
        return success_response(
            data=result,
            message="Cập nhật Header trang Hợp tác & Đào tạo thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật Header",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 3. PROPOSAL / REGISTRATION FORM SECTION
# ==========================================

@training_page_api.route("/proposal", methods=["POST", "PUT"])
@training_page_api.route("/proposal/<int:page_id>", methods=["POST", "PUT"])
def update_proposal(page_id=None):
    """Cập nhật phần Đề xuất / Form Đăng ký (Tiêu đề, Quyền lợi, Form Fields) của trang Hợp tác & Đào tạo"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")

        data = ProposalSectionRequestDTO().load(json_data)
        response = training_page_service.update_proposal_section(data, page_id)
        result = ProposalSectionResponse().dump(response)
        return success_response(
            data=result,
            message="Cập nhật phần Đề xuất & Form Đăng ký thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật phần Đề xuất & Form Đăng ký",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 4. DANH SÁCH KHÓA HỌC ĐƯỢC CHỌN HIỂN THỊ
# ==========================================

@training_page_api.route("/selected-trainings", methods=["POST", "PUT"])
@training_page_api.route("/selected-trainings/<int:page_id>", methods=["POST", "PUT"])
def update_selected_trainings(page_id=None):
    """Cập nhật danh sách ID các khóa đào tạo được chọn hiển thị"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or (json_data.get("id") if isinstance(json_data, dict) else None)

        if isinstance(json_data, list):
            training_ids = json_data
        else:
            data = SelectedTrainingsRequestDTO().load(json_data)
            training_ids = getattr(data, "training_ids", []) if not isinstance(data, dict) else data.get("training_ids", [])

        response = training_page_service.update_selected_trainings(training_ids, page_id)
        return success_response(
            data={"training_ids": response},
            message="Cập nhật danh sách khóa đào tạo hiển thị thành công",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Dữ liệu đầu vào không hợp lệ",
            details=e.messages,
            status_code=422,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật danh sách khóa đào tạo hiển thị",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 5. CÁC MÔ HÌNH HỢP TÁC (MODELS SECTION)
# ==========================================

@training_page_api.route("/models", methods=["POST", "PUT"])
@training_page_api.route("/models/<int:page_id>", methods=["POST", "PUT"])
def update_models_section(page_id=None):
    """Cập nhật các mô hình hợp tác (models_section)"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or (json_data.get("id") if isinstance(json_data, dict) else None)

        if isinstance(json_data, list):
            models_data = json_data
        else:
            models_data = json_data.get("models", [])

        response = training_page_service.update_models_section(models_data, page_id)
        return success_response(
            data={"models": response},
            message="Cập nhật các mô hình hợp tác thành công",
            status_code=200,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật mô hình hợp tác",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 6. CAM KẾT & CHỨNG NHẬN (CERTIFICATION)
# ==========================================

@training_page_api.route("/certification", methods=["POST", "PUT"])
@training_page_api.route("/certification/<int:page_id>", methods=["POST", "PUT"])
def update_certification_section(page_id=None):
    """Cập nhật phần Cam kết chất lượng & Giá trị chứng nhận (certification_section)"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or (json_data.get("id") if isinstance(json_data, dict) else None)

        response = training_page_service.update_certification_section(json_data, page_id)
        return success_response(
            data=response,
            message="Cập nhật phần Cam kết & Chứng nhận thành công",
            status_code=200,
        )
    except Exception as e:
        return error_response(
            message="Lỗi khi cập nhật phần Cam kết & Chứng nhận",
            details=str(e),
            status_code=500,
        )


