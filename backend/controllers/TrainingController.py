from flask import Blueprint, request
from marshmallow import ValidationError as MarshmallowValidationError

from dto.training_dto import TrainingFilterDTO, TrainingResponseDTO, CreateTrainingDTO
from services import training_service
from utils.json import error_response, success_response


training_api = Blueprint("training_api", __name__, url_prefix="/api/trainings")
training_schema = CreateTrainingDTO()
training_response_schema = TrainingResponseDTO()
training_filter_schema = TrainingFilterDTO()


@training_api.errorhandler(MarshmallowValidationError)
def handle_validation_error(error):
    return error_response(
        message="Dữ liệu đầu vào không hợp lệ.",
        status_code=422,
        error_code="VALIDATION_ERROR",
        details=error.messages,
    )


@training_api.get("")
def get_trainings():
    """
    Lấy danh sách khóa học
    Tìm một phần mã, tên hoặc chứng chỉ; lọc certificate khớp toàn bộ. Không phân biệt hoa/thường.
    ---
    tags: [Trainings]
    produces: [application/json]
    parameters:
      - name: search
        in: query
        type: string
        minLength: 1
        maxLength: 255
        description: Mã, tên khóa học hoặc chứng chỉ.
      - name: certificate
        in: query
        type: string
        minLength: 1
        maxLength: 255
        description: Tên chứng chỉ.
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
      TrainingWrite:
        type: object
        additionalProperties: false
        minProperties: 1
        properties:
          name:
            type: string
            minLength: 1
            maxLength: 255
            example: Nghệ thuật Lãnh đạo Đổi mới
          certificate:
            type: string
            minLength: 1
            maxLength: 255
            example: Executive Leadership Award
          time:
            type: string
            minLength: 1
            maxLength: 50
            example: 2 ngày Workshop thực chiến
          props:
            $ref: '#/definitions/TrainingProps'
      TrainingProps:
        type: object
        additionalProperties: false
        properties:
          target_audience:
            type: string
            minLength: 1
            example: Đội ngũ quản lý cấp trung và cao
          description:
            type: string
            minLength: 1
            example: Khai phóng tinh thần dám tạo đột phá.
          highlights:
            type: array
            minItems: 1
            items:
              type: string
              minLength: 1
            example: [Mô hình quản trị kích hoạt sáng kiến]
          locations:
            type: array
            minItems: 1
            items:
              type: string
              minLength: 1
            example: [Hà Nội, TP. Hồ Chí Minh]
      TrainingPropsComplete:
        allOf:
          - $ref: '#/definitions/TrainingProps'
          - type: object
            required: [target_audience, description, highlights, locations]
      TrainingCreate:
        allOf:
          - $ref: '#/definitions/TrainingWrite'
          - type: object
            required: [name, time, certificate, props]
            properties:
              props:
                $ref: '#/definitions/TrainingPropsComplete'
      Training:
        type: object
        properties:
          id:
            type: string
            example: VK-01
          name:
            type: string
          certificate:
            type: string
          time:
            type: string
          props:
            $ref: '#/definitions/TrainingPropsComplete'
      TrainingResult:
        type: object
        properties:
          success:
            type: boolean
            example: true
          message:
            type: string
          data:
            $ref: '#/definitions/Training'
    responses:
      200:
        description: Danh sách khóa học.
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
                $ref: '#/definitions/Training'
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
    filters = training_filter_schema.load(request.args.to_dict())
    trainings, meta = training_service.get_trainings(**filters)
    return success_response(data=training_response_schema.dump(trainings, many=True), meta=meta)


@training_api.get("/<string:training_id>")
def get_training(training_id):
    """
    Lấy khóa học theo ID
    ---
    tags: [Trainings]
    produces: [application/json]
    parameters:
      - name: training_id
        in: path
        type: string
        required: true
        description: Mã khóa học.
    responses:
      200:
        description: Thông tin khóa học.
        schema:
          $ref: '#/definitions/TrainingResult'
      404:
        description: Không tìm thấy khóa học.
    """
    training = training_service.get_training(training_id)
    return success_response(data=training_response_schema.dump(training))


@training_api.post("")
def create():
    """
    Tạo khóa học
    ID tự sinh dạng VK-01.
    ---
    tags: [Trainings]
    consumes: [application/json]
    produces: [application/json]
    parameters:
      - name: body
        in: body
        required: true
        schema:
          $ref: '#/definitions/TrainingCreate'
    responses:
      201:
        description: Tạo thành công.
        headers:
          Location:
            type: string
            description: URL của khóa học vừa tạo.
        schema:
          $ref: '#/definitions/TrainingResult'
      400:
        description: JSON sai cú pháp.
      415:
        description: Yêu cầu application/json.
      422:
        description: Dữ liệu không hợp lệ.
    """
    dto = training_schema.load(request.get_json())
    training = training_service.create_training(dto)
    response, status = success_response(
        data=training_response_schema.dump(training),
        message="Tạo thành công.",
        status_code=201,
    )
    response.headers["Location"] = f"{request.base_url}/{training.id}"
    return response, status


@training_api.route("/<string:training_id>", methods=["PUT", "PATCH"])
def update(training_id):
    """
    Cập nhật khóa học
    PUT thay thế dữ liệu; PATCH gộp các key trong props, giữ key không gửi.
    ---
    tags: [Trainings]
    consumes: [application/json]
    produces: [application/json]
    parameters:
      - name: training_id
        in: path
        type: string
        required: true
        description: Mã khóa học.
      - name: body
        in: body
        required: true
        description: Dữ liệu cập nhật.
        schema:
          $ref: '#/definitions/TrainingWrite'
    responses:
      200:
        description: Cập nhật thành công.
        schema:
          $ref: '#/definitions/TrainingResult'
      400:
        description: JSON sai cú pháp.
      404:
        description: Không tìm thấy khóa học.
      415:
        description: Yêu cầu application/json.
      422:
        description: Dữ liệu không hợp lệ.
    """
    partial = request.method == "PATCH"
    dto = training_schema.load(request.get_json(), partial=partial)
    training = training_service.update_training(training_id, dto, partial=partial)
    return success_response(
        data=training_response_schema.dump(training),
        message="Cập nhật thành công.",
    )


@training_api.delete("/<string:training_id>")
def delete(training_id):
    """
    Xóa khóa học
    ---
    tags: [Trainings]
    parameters:
      - name: training_id
        in: path
        type: string
        required: true
        description: Mã khóa học.
    responses:
      204:
        description: No Content
      404:
        description: Không tìm thấy khóa học.
    """
    training_service.delete_training(training_id)
    return "", 204
