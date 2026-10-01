from flask import Blueprint, request
from services import base_service
from dto.base_dto import (
    PageRequestDTO,
    PageUpdateRequestDTO,
    PageResponseDTO,
    HeaderItemDTO
)
from utils.json import success_response, error_response

base_api = Blueprint("base_api", __name__, url_prefix="/pages")


@base_api.route("/create", methods=["POST"])
def create_page():
    """
    Tạo mới một Page (Tạo item của header)
    ---
    tags:
      - Page & Header Management
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - slug
          properties:
            name:
              type: string
              example: "Sự kiện"
            slug:
              type: string
              example: "events"
            props:
              type: object
              example: {}
    responses:
      201:
        description: Tạo trang thành công
    """
    json_data = request.get_json() or {}
    data = PageRequestDTO().load(json_data)
    response = base_service.create_page(data)
    result = PageResponseDTO().dump(response)
    return success_response(
        data=result,
        message="Tạo Page (Header item) thành công",
        status_code=201
    )


@base_api.route("/", methods=["GET"])
def get_all_pages():
    """
    Lấy danh sách toàn bộ các Page (đầy đủ props)
    ---
    tags:
      - Page & Header Management
    responses:
      200:
        description: Lấy danh sách trang thành công
    """
    pages = base_service.get_all_pages()
    result = PageResponseDTO(many=True).dump(pages)
    return success_response(
        data=result,
        message="Lấy danh sách các trang thành công",
        status_code=200
    )


@base_api.route("/header", methods=["GET"])
def get_header_items():
    """
    Lấy danh sách các item cho Header Navigation (chỉ gồm id, name, slug)
    ---
    tags:
      - Page & Header Management
    responses:
      200:
        description: Lấy danh sách item header thành công
    """
    items = base_service.get_header_items()
    result = HeaderItemDTO(many=True).dump(items)
    return success_response(
        data=result,
        message="Lấy danh sách header items thành công",
        status_code=200
    )


@base_api.route("/<int:page_id>", methods=["GET"])
def get_page_by_id(page_id: int):
    """
    Lấy thông tin chi tiết một Page theo ID
    ---
    tags:
      - Page & Header Management
    parameters:
      - name: page_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Thành công
    """
    page = base_service.get_page_by_id(page_id)
    result = PageResponseDTO().dump(page)
    return success_response(
        data=result,
        message="Lấy thông tin trang thành công",
        status_code=200
    )


@base_api.route("/slug/<string:slug>", methods=["GET"])
def get_page_by_slug(slug: str):
    """
    Lấy thông tin chi tiết một Page theo slug (ví dụ: home, events, trainings,...)
    ---
    tags:
      - Page & Header Management
    parameters:
      - name: slug
        in: path
        type: string
        required: true
    responses:
      200:
        description: Thành công
    """
    page = base_service.get_page_by_slug(slug)
    result = PageResponseDTO().dump(page)
    return success_response(
        data=result,
        message="Lấy thông tin trang theo slug thành công",
        status_code=200
    )


@base_api.route("/<int:page_id>", methods=["PUT", "PATCH"])
def update_page(page_id: int):
    """
    Cập nhật thông tin Page
    ---
    tags:
      - Page & Header Management
    parameters:
      - name: page_id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            slug:
              type: string
            props:
              type: object
    responses:
      200:
        description: Cập nhật thành công
    """
    json_data = request.get_json() or {}
    data = PageUpdateRequestDTO().load(json_data)
    response = base_service.update_page(page_id, data)
    result = PageResponseDTO().dump(response)
    return success_response(
        data=result,
        message="Cập nhật trang thành công",
        status_code=200
    )


@base_api.route("/<int:page_id>", methods=["DELETE"])
def delete_page(page_id: int):
    """
    Xóa một Page
    ---
    tags:
      - Page & Header Management
    parameters:
      - name: page_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Xóa thành công
    """
    base_service.delete_page(page_id)
    return success_response(
        data=None,
        message="Xóa trang thành công",
        status_code=200
    )


@base_api.route("/upload", methods=["POST"])
def upload_image_endpoint():
    """Tải ảnh lên Cloudinary và trả về URL ảnh"""
    file = request.files.get("file") or request.files.get("image")
    if not file:
        return error_response(message="Không tìm thấy file ảnh tải lên.", status_code=400)
    folder = request.form.get("folder", "catalog")
    try:
        from services.image_storage_service import upload_image
        image_url = upload_image(file, folder=folder)
        return success_response(
            data={"url": image_url},
            message="Tải ảnh lên thành công",
            status_code=200
        )
    except Exception as e:
        return error_response(message=str(e), status_code=400)

