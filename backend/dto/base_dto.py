from marshmallow import fields
from dto.base_schema import BaseSchema


class PageRequestDTO(BaseSchema):
    name = fields.Str(required=True, error_messages={"required": "Tên trang (name) là bắt buộc"})
    slug = fields.Str(required=True, error_messages={"required": "Đường dẫn (slug) là bắt buộc"})
    props = fields.Dict(required=False, allow_none=True, load_default=dict, error_messages={"invalid": "props phải là định dạng JSON object"})
    is_visible = fields.Bool(required=False, load_default=True)


class PageUpdateRequestDTO(BaseSchema):
    name = fields.Str(required=False, allow_none=True)
    slug = fields.Str(required=False, allow_none=True)
    props = fields.Dict(required=False, allow_none=True, load_default=None, error_messages={"invalid": "props phải là định dạng JSON object"})
    is_visible = fields.Bool(required=False, allow_none=True)
    order_index = fields.Int(required=False, allow_none=True)


class PageResponseDTO(BaseSchema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    props = fields.Dict(dump_only=True)
    is_visible = fields.Bool(dump_only=True)
    order_index = fields.Int(dump_only=True)
    created_date = fields.Str(dump_only=True, allow_none=True)
    updated_date = fields.Str(dump_only=True, allow_none=True)


class HeaderItemDTO(BaseSchema):
    """DTO rút gọn cho danh sách item hiển thị trên Header Navigation"""
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    is_visible = fields.Bool(dump_only=True)
    order_index = fields.Int(dump_only=True)


class PageReorderItemDTO(BaseSchema):
    id = fields.Int(required=True, error_messages={"required": "Page id là bắt buộc"})
    order_index = fields.Int(required=True, error_messages={"required": "order_index là bắt buộc"})


class PageReorderRequestDTO(BaseSchema):
    orders = fields.List(fields.Nested(PageReorderItemDTO), required=True, error_messages={"required": "Danh sách orders là bắt buộc"})