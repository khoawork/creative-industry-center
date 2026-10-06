from marshmallow import Schema, ValidationError, fields, validate, validates

from dto.base_schema import BaseSchema
from dto.pagination_dto import PaginationFilterDTO


class AwardRequestDTO(BaseSchema):
    code = fields.String(required=True, validate=validate.Length(min=1, max=50))
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    description = fields.String(required=True)
    decision_number = fields.String(
        required=True, validate=validate.Length(min=1, max=50)
    )
    image = fields.String(
        allow_none=True, load_default=None, validate=validate.Length(max=255)
    )
    year = fields.Integer(
        allow_none=True, load_default=None, validate=validate.Range(min=1, max=9999)
    )
    icon = fields.String(
        allow_none=True, load_default=None, validate=validate.Length(max=255)
    )
    props = fields.Dict(allow_none=True, load_default=None)

    @validates("name", "title", "description", "decision_number")
    def validate_not_blank(self, value, **kwargs):
        if not value.strip():
            raise ValidationError("Không được để trống.")


class AwardResponseDTO(AwardRequestDTO):
    id = fields.String(dump_only=True)


class AwardFilterDTO(PaginationFilterDTO):
    search = fields.String(validate=validate.Length(min=1, max=255))
    title = fields.String(validate=validate.Length(min=1, max=255))
    year = fields.Integer(validate=validate.Range(min=1, max=9999))


# pages


class AwardCardDetailPageDto(BaseSchema):
    card = fields.Nested(AwardResponseDTO, required=True)
    scope = fields.String(required=True, validate=validate.Length(min=1, max=255))
    award_evaluation_criteria = fields.List(
        fields.String(validate=validate.Length(min=1, max=255)), required=True
    )
    nomination_dossier = fields.List(
        fields.String(validate=validate.Length(min=1, max=255)), required=True
    )
    download_old_template_url = fields.String(
        required=True, validate=validate.Length(min=1, max=255)
    )
    submit_candidacy_profile_url = fields.String(
        required=True, validate=validate.Length(min=1, max=255)
    )


class AwardCardDetailPageResponseDto(BaseSchema):
    card = fields.Nested(AwardResponseDTO, required=True)
    scope = fields.String(required=True, validate=validate.Length(min=1, max=255))
    award_evaluation_criteria = fields.List(
        fields.String(validate=validate.Length(min=1, max=255)), required=True
    )
    nomination_dossier = fields.List(
        fields.String(validate=validate.Length(min=1, max=255)), required=True
    )
    download_old_template_url = fields.String(
        required=True, validate=validate.Length(min=1, max=255)
    )
    submit_candidacy_profile_url = fields.String(
        required=True, validate=validate.Length(min=1, max=255)
    )


class AwardListCardPageDto(BaseSchema):
    count = fields.Integer(required=True, validate=validate.Range(min=0))
    title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    list_card = fields.List(fields.Nested(AwardResponseDTO), required=True)
    award_ids = fields.List(
        fields.String(validate=validate.Length(min=1, max=50)),
        allow_none=True,
        load_default=list,
    )


class AwardHeaderPageDto(BaseSchema):
    tittle = fields.String(required=True, validate=validate.Length(min=10, max=255))
    title = fields.String(
        allow_none=True, load_default=None, validate=validate.Length(min=1, max=255)
    )
    sub_title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    description = fields.String(required=True)


# class AwardRegulationDetailPageDto(BaseSchema):


class AwardLatestHonorBoardDto(BaseSchema):
    icon = fields.String(required=True, validate=validate.Length(min=1, max=255))
    image = fields.String(
        allow_none=True, load_default=None, validate=validate.Length(max=255)
    )
    title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    sub_name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    description = fields.String(allow_none=True, load_default="")
    time = fields.String(required=True, validate=validate.Length(min=1, max=255))
    decision_number = fields.String(
        required=True, validate=validate.Length(min=1, max=255)
    )


class AwardLatestHonorBoardResponseDto(AwardLatestHonorBoardDto):
    id = fields.String(required=True)


class AwardLayoutPageDto(BaseSchema):
    header = fields.Nested(AwardHeaderPageDto, required=True)
    list_card = fields.Nested(AwardListCardPageDto, required=True)
    latest_honor_board = fields.List(
        fields.Nested(AwardLatestHonorBoardResponseDto), required=True
    )


class AwardPageDto(BaseSchema):
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    slug = fields.String(required=True, validate=validate.Length(min=1, max=255))
    props = fields.Nested(AwardLayoutPageDto, required=True)


class AwardPageResponseDto(AwardPageDto):
    id = fields.String(required=True)
