from marshmallow import Schema, fields as Field
from dto import BaseSchema


class RecordActionDto(BaseSchema):
    nomination = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=255)
    )
    download = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=255)
    )


class RecordResquestDto(BaseSchema):
    id = Field.String(load_default=None, allow_none=True)
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    subtitle = Field.String(
        validate=Field.validate.Length(min=1, max=255), allow_none=True
    )
    rank = Field.String(required=True, validate=Field.validate.Length(min=1, max=50))
    icon = Field.String(validate=Field.validate.Length(min=1, max=255), allow_none=True)
    category = Field.String(
        validate=Field.validate.Length(min=1, max=255), allow_none=True
    )
    cycle = Field.String(validate=Field.validate.Length(min=1, max=50), allow_none=True)
    criteria = Field.List(
        Field.String(validate=Field.validate.Length(min=1, max=255)), allow_none=True
    )
    action = Field.Raw(allow_none=True)


class RecordResponseDto(RecordResquestDto):
    id = Field.String(required=True)


class RecordMetricsDto(BaseSchema):
    label = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    value = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))


class RecordHeaderDto(BaseSchema):
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    subtitle = Field.String(
        validate=Field.validate.Length(min=1, max=255), allow_none=True
    )
    icon = Field.String(validate=Field.validate.Length(min=1, max=255), allow_none=True)
    slogan = Field.String(
        validate=Field.validate.Length(min=1, max=255), allow_none=True
    )
    metrics = Field.List(Field.Nested(RecordMetricsDto), allow_none=True)


class RecordHeaderResponseDto(RecordHeaderDto):
    id = Field.Integer(required=True)


class RecordHolderGovernanceCardDto(BaseSchema):
    icon = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    description = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=250)
    )


class RecordHolderGovernanceCardResponseDto(RecordHolderGovernanceCardDto):
    id = Field.Integer(required=True)


class RecordHolderGovernanceCtaRoleDto(BaseSchema):
    role = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    value = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))


class RecordHolderGovernanceCtaDto(BaseSchema):
    icon = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    cycle = Field.String(required=True, validate=Field.validate.Length(min=1, max=50))
    number_decision = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=50)
    )
    roles = Field.List(
        Field.Nested(RecordHolderGovernanceCtaRoleDto),
        required=True,
        allow_none=True,
    )
    btn_action = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=255)
    )


class RecordHolderGovernanceCtaResponseDto(RecordHolderGovernanceCtaDto):
    id = Field.Integer(required=True)


class RecordHolderGovernanceDto(BaseSchema):
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    subtitle = Field.String(
        validate=Field.validate.Length(min=1, max=255), allow_none=True
    )
    description = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=550), allow_none=True
    )

    cards = Field.List(
        Field.Nested(RecordHolderGovernanceCardDto),
        required=True,
        allow_none=True,
    )
    cta = (
        Field.Nested(
            RecordHolderGovernanceCtaDto,
            required=True,
            allow_none=True,
        ),
    )


class RecordHolderGovernanceResponseDto(RecordHolderGovernanceDto):
    id = Field.Integer(required=True)


class RecordHonorRollCardDto(BaseSchema):
    id = Field.Raw(load_default=None, allow_none=True)
    year = Field.String(load_default="Năm 2024", allow_none=True)
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    description = Field.String(
        load_default="", allow_none=True
    )
    category = Field.String(
        load_default="", allow_none=True
    )
    image = Field.String(load_default="", allow_none=True)
    badge = Field.String(load_default="", allow_none=True)
    award_title = Field.String(load_default="", allow_none=True)
    icon = Field.String(load_default="trophy", allow_none=True)
    is_visible = Field.Boolean(load_default=True, allow_none=True)
    award_label = Field.String(load_default="Đề Cử Được Vinh Danh:", allow_none=True)


class RecordHonorRollAwardDto(BaseSchema):
    label = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    value = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))


class RecordHonorRollAwardResponseDto(RecordHonorRollAwardDto):
    id = Field.Integer(required=True)


class RecordHonorRollDto(BaseSchema):
    id = Field.Raw(load_default=None, allow_none=True)
    title = Field.String(load_default="BẢNG VÀNG DANH DỰ", allow_none=True)
    subtitle = Field.String(
        load_default="Cá Nhân & Tập Thể Được Tôn Vinh Gần Đây", allow_none=True
    )
    description = Field.String(
        load_default="", allow_none=True
    )
    is_visible = Field.Boolean(load_default=True, allow_none=True)
    award_nomination_name = Field.Nested(RecordHonorRollAwardDto, allow_none=True, load_default=None)
    categories = Field.Raw(load_default=None, allow_none=True)
    cards = Field.List(
        Field.Nested(RecordHonorRollCardDto),
        load_default=[],
        allow_none=True,
    )


class RecordHonorRollResponseDto(RecordHonorRollDto):
    id = Field.Raw(allow_none=True)


class RecordSectionProcessInfoDto(BaseSchema):
    label = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    value = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))


class RecordSectionProcessCardDto(BaseSchema):

    icon = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    description = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=550), allow_none=True
    )
    info = Field.List(
        Field.Nested(RecordSectionProcessInfoDto),
        required=True,
        allow_none=True,
    )
    color = Field.String(required=True, validate=Field.validate.Length(min=1, max=50))


class RecordSectionProcessCardResponseDto(RecordSectionProcessCardDto):
    id = Field.Integer(required=True)


class RecordSectionProcessDto(BaseSchema):
    title = Field.String(required=True, validate=Field.validate.Length(min=1, max=255))
    subtitle = Field.String(
        validate=Field.validate.Length(min=1, max=255), allow_none=True
    )
    description = Field.String(
        required=True, validate=Field.validate.Length(min=1, max=550), allow_none=True
    )
    cards = Field.List(
        Field.Nested(RecordSectionProcessCardResponseDto),
        required=True,
        allow_none=True,
    )


class RecordSectionProcessResponseDto(RecordSectionProcessDto):
    id = Field.Integer(required=True)


class RecordPageDto(BaseSchema):
    header = Field.Nested(RecordHeaderDto, required=True)
    governance = Field.Nested(RecordHolderGovernanceResponseDto, required=True)
    records = Field.List(
        Field.Nested(RecordResponseDto), required=True, allow_none=True
    )
    honor_rolls = Field.List(
        Field.Nested(RecordHonorRollResponseDto), required=True, allow_none=True
    )
    process = Field.Nested(RecordSectionProcessResponseDto, required=True)


class RecordPageResponseDto(RecordPageDto):
    id = Field.Integer(required=True)
