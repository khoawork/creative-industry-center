from flask import Blueprint, request
from marshmallow import ValidationError as MarshmallowValidationError

from dto.award_dto import (
    AwardHeaderPageDto,
    AwardLatestHonorBoardDto,
    AwardLatestHonorBoardResponseDto,
    AwardResponseDTO,
)
from services.pages import award_services
from utils.json import error_response, success_response

award_page_api = Blueprint("award_page_api", __name__, url_prefix="/award-page")
header_schema = AwardHeaderPageDto()
honor_schema = AwardLatestHonorBoardDto()
honor_response_schema = AwardLatestHonorBoardResponseDto()
award_response_schema = AwardResponseDTO()


@award_page_api.errorhandler(MarshmallowValidationError)
def handle_validation_error(error):
    return error_response(
        message="Dữ liệu đầu vào không hợp lệ.",
        status_code=422,
        error_code="VALIDATION_ERROR",
        details=error.messages,
    )


def page_response():
    page, props, awards = award_services.get_page_data()
    props["list_card"]["list_card"] = award_response_schema.dump(awards, many=True)
    return {
        "id": page.id if page else None,
        "name": page.name if page else "Giải thưởng",
        "slug": "award",
        "props": props,
    }


@award_page_api.get("")
def get_award_page():
    return success_response(data=page_response())


@award_page_api.get("/header")
def get_header():
    return success_response(data=page_response()["props"]["header"])


@award_page_api.patch("/list-card")
def update_list_card():
    payload = request.get_json() or {}
    award_ids = payload.get("award_ids")
    if not isinstance(award_ids, list):
        return error_response("award_ids phải là một danh sách.", 422)
    award_services.update_award_selection(award_ids)
    return success_response(
        data=page_response(), message="Đã cập nhật danh sách award hiển thị."
    )


@award_page_api.patch("/header")
@award_page_api.put("/header")
def update_header():
    data = header_schema.load(request.get_json() or {}, partial=True)
    award_services.update_header(vars(data))
    return success_response(data=page_response(), message="Cập nhật header thành công.")


@award_page_api.get("/latest-honor-board")
def get_honor_board():
    return success_response(
        data=honor_response_schema.dump(award_services.get_honor_board(), many=True)
    )


@award_page_api.post("/latest-honor-board")
def create_honor_board():
    data = honor_schema.load(request.get_json() or {})
    item = award_services.create_honor_board(vars(data))
    return success_response(
        data=honor_response_schema.dump(item),
        message="Tạo honor board thành công.",
        status_code=201,
    )


@award_page_api.patch("/latest-honor-board/<string:item_id>")
@award_page_api.put("/latest-honor-board/<string:item_id>")
def update_honor_board(item_id):
    data = honor_schema.load(request.get_json() or {}, partial=True)
    try:
        item = award_services.update_honor_board(item_id, vars(data))
    except ValueError as error:
        return error_response(str(error), 404)
    return success_response(
        data=honor_response_schema.dump(item),
        message="Cập nhật honor board thành công.",
    )


@award_page_api.delete("/latest-honor-board/<string:item_id>")
def delete_honor_board(item_id):
    try:
        award_services.delete_honor_board(item_id)
    except ValueError as error:
        return error_response(str(error), 404)
    return "", 204
