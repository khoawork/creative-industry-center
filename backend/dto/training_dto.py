from marshmallow import Schema, ValidationError, fields, validate, validates

from dto.base_schema import BaseSchema
from dto.pagination_dto import PaginationFilterDTO


def validate_not_blank(value):
    if not value.strip():
        raise ValidationError("Không được để trống.")


class TrainingPropsDTO(Schema):
    target_audience = fields.String(required=True, validate=validate_not_blank)
    description = fields.String(required=True, validate=validate_not_blank)
    highlights = fields.List(
        fields.String(validate=validate_not_blank),
        required=True,
        validate=validate.Length(min=1),
    )
    locations = fields.List(
        fields.String(validate=validate_not_blank),
        required=True,
        validate=validate.Length(min=1),
    )


class CreateTrainingDTO(BaseSchema):
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    time = fields.String(required=True, validate=validate.Length(min=1, max=50))
    certificate = fields.String(required=True, validate=validate.Length(min=1, max=255))
    props = fields.Nested(TrainingPropsDTO, required=True)

    @validates("name", "time", "certificate")
    def validate_text(self, value, **kwargs):
        validate_not_blank(value)


class TrainingFilterDTO(PaginationFilterDTO):
    search = fields.String(validate=[validate.Length(min=1, max=255), validate_not_blank])
    certificate = fields.String(validate=[validate.Length(min=1, max=255), validate_not_blank])


class TrainingResponseDTO(CreateTrainingDTO):
    id = fields.String(dump_only=True)
