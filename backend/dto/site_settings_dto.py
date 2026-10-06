from marshmallow import fields
from dto.base_schema import BaseSchema


class FooterLinkDTO(BaseSchema):
    label = fields.Str(required=True, error_messages={"required": "Tên liên kết (label) là bắt buộc."})
    href = fields.Str(required=True, error_messages={"required": "Đường dẫn liên kết (href) là bắt buộc."})


class FooterGroupDTO(BaseSchema):
    title = fields.Str(required=True, error_messages={"required": "Tiêu đề nhóm liên kết (title) là bắt buộc."})
    links = fields.List(
        fields.Nested(FooterLinkDTO),
        required=True,
        error_messages={"required": "Danh sách liên kết (links) là bắt buộc."}
    )


class FooterContactDTO(BaseSchema):
    title = fields.Str(allow_none=True, load_default="THÔNG TIN LIÊN HỆ", dump_default="THÔNG TIN LIÊN HỆ")
    address = fields.Str(required=True, error_messages={"required": "Địa chỉ trụ sở là bắt buộc."})
    phone = fields.Str(required=True, error_messages={"required": "Số điện thoại đường dây nóng là bắt buộc."})
    phone_href = fields.Str(allow_none=True, load_default="", dump_default="")
    emails = fields.List(
        fields.Str(),
        required=True,
        error_messages={"required": "Danh sách thư điện tử là bắt buộc."}
    )


class FooterDTO(BaseSchema):
    short_name = fields.Str(allow_none=True, load_default="TTCNST", dump_default="TTCNST")
    institute = fields.Str(allow_none=True, load_default="VIỆN KỲ LỤC VIỆT NAM", dump_default="VIỆN KỲ LỤC VIỆT NAM")
    description = fields.Str(required=True, error_messages={"required": "Mô tả chân trang là bắt buộc."})
    groups = fields.List(
        fields.Nested(FooterGroupDTO),
        required=True,
        error_messages={"required": "Danh sách nhóm liên kết là bắt buộc."}
    )
    contact = fields.Nested(
        FooterContactDTO,
        required=True,
        error_messages={"required": "Thông tin liên hệ là bắt buộc."}
    )
    copyright = fields.Str(required=True, error_messages={"required": "Nội dung bản quyền là bắt buộc."})


class SiteSettingsRequestDTO(BaseSchema):
    logo = fields.Str(allow_none=True, load_default="")
    company_name = fields.Str(required=True, error_messages={"required": "Tên công ty / trung tâm là bắt buộc."})
    company_tagline = fields.Str(allow_none=True, load_default="")
    footer = fields.Nested(
        FooterDTO,
        required=True,
        error_messages={"required": "Cấu hình footer là bắt buộc."}
    )


class SiteSettingsResponseDTO(BaseSchema):
    id = fields.Int(dump_only=True)
    logo = fields.Str(dump_only=True)
    company_name = fields.Str(dump_only=True)
    company_tagline = fields.Str(dump_only=True)
    footer = fields.Nested(FooterDTO, dump_only=True)
    created_date = fields.DateTime(dump_only=True)
    updated_date = fields.DateTime(dump_only=True)

