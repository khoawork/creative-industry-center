from flask import Blueprint, request
from marshmallow import ValidationError

from dto.project_page_dto import (
    HeaderSectionRequestDTO,
    HeaderSectionResponse,
    ProposalSectionRequestDTO,
    ProposalSectionResponse,
    ProjectPageResponse,
    SelectedProjectsRequestDTO,
    SelectedProjectsResponse,
)
from services import project_page_service
from utils.error import APIException
from utils.json import error_response, success_response

project_page_api = Blueprint("project_page_api", __name__, url_prefix="/project-page")


# ==========================================
# 1. TOÀN BỘ TRANG PROJECT PAGE (FULL PAGE)
# ==========================================

@project_page_api.route("", methods=["GET"])
@project_page_api.route("/", methods=["GET"])
@project_page_api.route("/<int:page_id>", methods=["GET"])
def get_page(page_id=None):
    """Lấy dữ liệu toàn bộ trang Project Page"""
    try:
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or request.args.get("page_id", type=int)
        response = project_page_service.get_project_page(page_id)
        result = ProjectPageResponse().dump(response)
        return success_response(
            data=result,
            message="Lấy dữ liệu trang Dự án thành công",
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
            message="Lỗi khi lấy dữ liệu trang Dự án",
            details=str(e),
            status_code=500,
        )


@project_page_api.route("", methods=["PUT"])
@project_page_api.route("/", methods=["PUT"])
@project_page_api.route("/<int:page_id>", methods=["PUT"])
def update_page(page_id=None):
    """Cập nhật thông tin toàn bộ trang Project Page"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")
        response = project_page_service.update_project_page(page_id, json_data)
        result = ProjectPageResponse().dump(response)
        return success_response(
            data=result,
            message="Cập nhật trang Dự án thành công",
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
            message="Lỗi khi cập nhật trang Dự án",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 2. HEADER / HERO SECTION
# ==========================================

@project_page_api.route("/header", methods=["POST", "PUT"])
@project_page_api.route("/header/<int:page_id>", methods=["POST", "PUT"])
def update_header(page_id=None):
    """Cập nhật Header / Hero Section của trang Dự án"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")

        data = HeaderSectionRequestDTO().load(json_data)
        response = project_page_service.update_header_section(data, page_id)
        result = HeaderSectionResponse().dump(response)
        return success_response(
            data=result,
            message="Cập nhật phần Header trang Dự án thành công",
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
            message="Lỗi khi cập nhật phần Header",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 3. PROPOSAL / CTA SECTION
# ==========================================

@project_page_api.route("/proposal", methods=["POST", "PUT"])
@project_page_api.route("/proposal/<int:page_id>", methods=["POST", "PUT"])
def update_proposal(page_id=None):
    """Cập nhật Proposal / Form Section của trang Dự án"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or json_data.get("id") or json_data.get("idPage")

        data = ProposalSectionRequestDTO().load(json_data)
        response = project_page_service.update_proposal_section(data, page_id)
        result = ProposalSectionResponse().dump(response)
        return success_response(
            data=result,
            message="Cập nhật phần Đề xuất Dự án thành công",
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
            message="Lỗi khi cập nhật phần Đề xuất",
            details=str(e),
            status_code=500,
        )


# ==========================================
# 4. DANH SÁCH DỰ ÁN ĐƯỢC CHỌN HIỂN THỊ
# ==========================================

@project_page_api.route("/selected-projects", methods=["POST", "PUT"])
@project_page_api.route("/selected-projects/<int:page_id>", methods=["POST", "PUT"])
def update_selected_projects(page_id=None):
    """Cập nhật danh sách ID các dự án được chọn hiển thị"""
    try:
        json_data = request.get_json() or {}
        if page_id is None:
            page_id = request.args.get("idPage", type=int) or (json_data.get("id") if isinstance(json_data, dict) else None)

        if isinstance(json_data, list):
            project_ids = json_data
        else:
            data = SelectedProjectsRequestDTO().load(json_data)
            project_ids = getattr(data, "project_ids", []) if not isinstance(data, dict) else data.get("project_ids", [])

        response = project_page_service.update_selected_projects(project_ids, page_id)
        return success_response(
            data={"project_ids": response},
            message="Cập nhật danh sách dự án hiển thị thành công",
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
            message="Lỗi khi cập nhật danh sách dự án hiển thị",
            details=str(e),
            status_code=500,
        )
