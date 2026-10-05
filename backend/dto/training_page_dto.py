from marshmallow import fields
from dto.base_schema import BaseSchema


class StatisticItemDTO(BaseSchema):
    label = fields.Str(required=True, error_messages={"required": "label thống kê là bắt buộc"})
    value = fields.Str(required=True, error_messages={"required": "value thống kê là bắt buộc"})
    sublabel = fields.Str(allow_none=True, load_default="", dump_default="")


class HeaderSectionRequestDTO(BaseSchema):
    badge = fields.Str(required=True, error_messages={"required": "badge danh mục là bắt buộc"})
    title = fields.Str(required=True, error_messages={"required": "tiêu đề chính là bắt buộc"})
    description = fields.Str(required=True, error_messages={"required": "mô tả là bắt buộc"})
    statistics = fields.List(
        fields.Nested(StatisticItemDTO),
        required=True,
        error_messages={"required": "danh sách statistics là bắt buộc"}
    )


class HeaderSectionResponse(BaseSchema):
    badge = fields.Str(dump_only=True)
    title = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    statistics = fields.List(fields.Nested(StatisticItemDTO), dump_only=True)


class TrainingModelItemDTO(BaseSchema):
    model = fields.Str(required=True, error_messages={"required": "tên mô hình là bắt buộc"})
    icon = fields.Str(allow_none=True, load_default="hub", dump_default="hub")
    title = fields.Str(required=True, error_messages={"required": "tiêu đề mô hình là bắt buộc"})
    description = fields.Str(required=True, error_messages={"required": "mô tả mô hình là bắt buộc"})
    action = fields.Str(allow_none=True, load_default="", dump_default="")


class FormFieldDTO(BaseSchema):
    id = fields.Str(allow_none=True, load_default="")
    label = fields.Str(required=True, error_messages={"required": "chủ đề / nhãn ô nhập là bắt buộc"})
    placeholder = fields.Str(allow_none=True, load_default="", dump_default="")
    type = fields.Str(allow_none=True, load_default="text", dump_default="text")
    options = fields.List(fields.Str(), allow_none=True, load_default=[], dump_default=[])
    required = fields.Bool(allow_none=True, load_default=False, dump_default=False)
    width = fields.Str(allow_none=True, load_default="full", dump_default="full")


class ProposalSectionRequestDTO(BaseSchema):
    tag = fields.Str(required=True, error_messages={"required": "tag đề xuất là bắt buộc"})
    title = fields.Str(required=True, error_messages={"required": "tiêu đề đề xuất là bắt buộc"})
    description = fields.Str(required=True, error_messages={"required": "mô tả đề xuất là bắt buộc"})
    benefits = fields.List(
        fields.Str(),
        required=True,
        error_messages={"required": "danh sách benefits là bắt buộc"}
    )
    form_title = fields.Str(required=True, error_messages={"required": "tiêu đề form là bắt buộc"})
    form_description = fields.Str(required=True, error_messages={"required": "mô tả form là bắt buộc"})
    button_text = fields.Str(allow_none=True, load_default="GỬI HỒ SƠ ĐĂNG KÝ", dump_default="GỬI HỒ SƠ ĐĂNG KÝ")
    form_fields = fields.List(fields.Nested(FormFieldDTO), allow_none=True, load_default=[], dump_default=[])


class ProposalSectionResponse(BaseSchema):
    tag = fields.Str(dump_only=True)
    title = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    benefits = fields.List(fields.Str(), dump_only=True)
    form_title = fields.Str(dump_only=True)
    form_description = fields.Str(dump_only=True)
    button_text = fields.Str(dump_only=True)
    form_fields = fields.List(fields.Nested(FormFieldDTO), dump_only=True)


class TrainingPageRequestDTO(BaseSchema):
    name = fields.Str(allow_none=True)
    slug = fields.Str(allow_none=True)
    props = fields.Dict(allow_none=True)


class TrainingPageResponse(BaseSchema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    props = fields.Dict(dump_only=True)
    created_date = fields.Str(dump_only=True, allow_none=True)
    updated_date = fields.Str(dump_only=True, allow_none=True)


class SelectedTrainingsRequestDTO(BaseSchema):
    training_ids = fields.List(
        fields.Raw(),
        required=True,
        error_messages={"required": "danh sách training_ids là bắt buộc"}
    )


class SelectedTrainingsResponse(BaseSchema):
    training_ids = fields.List(fields.Raw(), dump_only=True)
