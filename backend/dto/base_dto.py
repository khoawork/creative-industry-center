from marshmallow import fields
from dto import BaseSchema


class PageRequestDTO(BaseSchema):
    name = fields.Str(required=True, error_messages={"required": "Tên trang (name) là bắt buộc"})
    slug = fields.Str(required=True, error_messages={"required": "Đường dẫn (slug) là bắt buộc"})
    props = fields.Dict(load_default=dict, error_messages={"invalid": "props phải là định dạng JSON object"})


class PageResponseDTO(BaseSchema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    props = fields.Dict(dump_only=True)
    created_date = fields.Str(dump_only=True, allow_none=True)
    updated_date = fields.Str(dump_only=True, allow_none=True)


class HeaderItemDTO(BaseSchema):
    """DTO rút gọn cho danh sách item hiển thị trên Header Navigation"""
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)