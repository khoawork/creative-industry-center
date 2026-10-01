import json
from flask import Blueprint, request
from marshmallow import ValidationError as MarshmallowValidationError

from dto.award_dto import AwardFilterDTO, AwardResponseDTO, CreateAwardDTO
from services import award_service
from services.image_storage_service import upload_image
from utils.json import error_response, success_response


award_api = Blueprint("award_api", __name__, url_prefix="/api/awards")
award_schema = CreateAwardDTO()
award_response_schema = AwardResponseDTO()
award_filter_schema = AwardFilterDTO()


@award_api.errorhandler(MarshmallowValidationError)
def handle_validation_error(error):
    return error_response(
        message="Dữ liệu đầu vào không hợp lệ.",
        status_code=422,
        error_code="VALIDATION_ERROR",
        details=error.messages,
    )


@award_api.get("")
def get_awards():
    """
    Lấy danh sách giải thưởng
    Tìm theo tên hoặc mã; lọc title khớp toàn bộ. Không phân biệt hoa/thường.
    ---
    tags: [Awards]
    produces: [application/json]
    parameters:
      - name: search
        in: query
        type: string
        minLength: 1
        maxLength: 255
        description: Tên hoặc mã giải thưởng.
      - name: title
        in: query
        type: string
        minLength: 1
        maxLength: 255
        description: Tiêu đề giải thưởng.
      - name: year
        in: query
        type: integer
        minimum: 1
        maximum: 9999
        description: Năm tạo.
      - name: page
        in: query
        type: integer
        minimum: 1
        default: 1
        description: Số trang.
      - name: per_page
        in: query
        type: integer
        minimum: 1
        description: Số bản ghi mỗi trang.
    definitions:
      AwardWrite:
        type: object
        additionalProperties: false
        minProperties: 1
        properties:
          name:
            type: string
            minLength: 1
            maxLength: 255
            example: Giải thưởng sáng tạo
          title:
            type: string
            minLength: 1
            maxLength: 255
            example: Giải nhất
          description:
            type: string
            minLength: 1
            example: Tôn vinh các ý tưởng sáng tạo.
          decision_number:
            type: string
            minLength: 1
            maxLength: 50
            example: QD-01
          image:
            type: string
            maxLength: 255
            x-nullable: true
            description: Đường dẫn ảnh; null để xóa.
            example: /uploads/award.jpg
          props:
            $ref: '#/definitions/AwardProps'
      AwardProps:
        type: object
        x-nullable: true
        additionalProperties: false
        properties:
          icon:
            type: string
            minLength: 1
            example: trophy
      AwardCreate:
        allOf:
          - $ref: '#/definitions/AwardWrite'
          - type: object
            required: [name, title, description, decision_number]
      Award:
        type: object
        properties:
          id:
            type: string
            example: VK-AWD-01
          name:
            type: string
          title:
            type: string
          description:
            type: string
          decision_number:
            type: string
          image:
            type: string
            x-nullable: true
          props:
            $ref: '#/definitions/AwardProps'
      AwardResult:
        type: object
        properties:
          success:
            type: boolean
            example: true
          message:
            type: string
          data:
            $ref: '#/definitions/Award'
    responses:
      200:
        description: Danh sách giải thưởng.
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
            data:
              type: array
              items:
                $ref: '#/definitions/Award'
            meta:
              type: object
              properties:
                page:
                  type: integer
                per_page:
                  type: integer
                total:
                  type: integer
                total_pages:
                  type: integer
      422:
        description: Bộ lọc không hợp lệ.
    """
    filters = award_filter_schema.load(request.args.to_dict())
    awards, meta = award_service.get_awards(**filters)
    return success_response(data=award_response_schema.dump(awards, many=True), meta=meta)


@award_api.get("/<string:award_id>")
def get_award(award_id):
    """
    Lấy giải thưởng theo ID
    ---
    tags: [Awards]
    produces: [application/json]
    parameters:
      - name: award_id
        in: path
        type: string
        required: true
        description: Mã giải thưởng.
    responses:
      200:
        description: Thông tin giải thưởng.
        schema:
          $ref: '#/definitions/AwardResult'
      404:
        description: Không tìm thấy giải thưởng.
    """
    award = award_service.get_award(award_id)
    return success_response(data=award_response_schema.dump(award))


@award_api.post("")
def create():
    """
    Tạo giải thưởng
    ID tự sinh dạng VK-AWD-01.
    ---
    tags: [Awards]
    consumes: [application/json]
    produces: [application/json]
    parameters:
      - name: body
        in: body
        required: true
        schema:
          $ref: '#/definitions/AwardCreate'
    responses:
      201:
        description: Tạo thành công.
        headers:
          Location:
            type: string
            description: URL của giải thưởng vừa tạo.
        schema:
          $ref: '#/definitions/AwardResult'
      400:
        description: JSON sai cú pháp.
      415:
        description: Yêu cầu application/json.
      422:
        description: Dữ liệu không hợp lệ.
    """
    if request.mimetype == "multipart/form-data":
        json_data = json.loads(request.form.get("data") or "{}")
        image_file = request.files.get("image") or request.files.get("featured_image")
        if image_file:
            json_data["image"] = upload_image(image_file, folder="awards")
    else:
        json_data = request.get_json() or {}

    dto = award_schema.load(json_data)
    award = award_service.create_award(dto)
    response, status = success_response(
        data=award_response_schema.dump(award),
        message="Tạo thành công.",
        status_code=201,
    )
    response.headers["Location"] = f"{request.base_url}/{award.id}"
    return response, status


@award_api.route("/<string:award_id>", methods=["PUT", "PATCH"])
def update(award_id):
    """
    Cập nhật giải thưởng
    PUT thay thế dữ liệu (bỏ image/props sẽ đặt null); PATCH sửa từng trường.
    PATCH gộp các key trong props; props null để xóa.
    ---
    tags: [Awards]
    consumes: [application/json]
    produces: [application/json]
    parameters:
      - name: award_id
        in: path
        type: string
        required: true
        description: Mã giải thưởng.
      - name: body
        in: body
        required: true
        description: Dữ liệu cập nhật.
        schema:
          $ref: '#/definitions/AwardWrite'
    responses:
      200:
        description: Cập nhật thành công.
        schema:
          $ref: '#/definitions/AwardResult'
      400:
        description: JSON sai cú pháp.
      404:
        description: Không tìm thấy giải thưởng.
      415:
        description: Yêu cầu application/json.
      422:
        description: Dữ liệu không hợp lệ.
    """
    partial = request.method == "PATCH"
    if request.mimetype == "multipart/form-data":
        json_data = json.loads(request.form.get("data") or "{}")
        image_file = request.files.get("image") or request.files.get("featured_image")
        if image_file:
            json_data["image"] = upload_image(image_file, folder="awards")
    else:
        json_data = request.get_json() or {}

    dto = award_schema.load(json_data, partial=partial)
    award = award_service.update_award(award_id, dto, partial=partial)
    return success_response(
        data=award_response_schema.dump(award),
        message="Cập nhật thành công.",
    )


@award_api.delete("/<string:award_id>")
def delete(award_id):
    """
    Xóa giải thưởng
    ---
    tags: [Awards]
    parameters:
      - name: award_id
        in: path
        type: string
        required: true
        description: Mã giải thưởng.
    responses:
      204:
        description: No Content
      404:
        description: Không tìm thấy giải thưởng.
    """
    award_service.delete_award(award_id)
    return "", 204
