from marshmallow import Schema, ValidationError, fields, validate, validates

from dto.base_schema import BaseSchema
from dto.pagination_dto import PaginationFilterDTO


class AwardPropsDTO(Schema):
    icon = fields.String(validate=validate.Length(min=1))


class CreateAwardDTO(BaseSchema):
    id = fields.String(allow_none=True, load_default=None, validate=validate.Length(max=50))
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    title = fields.String(required=True, validate=validate.Length(min=1, max=255))
    description = fields.String(required=True)
    decision_number = fields.String(required=True, validate=validate.Length(min=1, max=50))
    image = fields.String(allow_none=True, load_default=None, validate=validate.Length(max=255))
    props = fields.Nested(AwardPropsDTO, allow_none=True, load_default=None)

    @validates("name", "title", "description", "decision_number")
    def validate_not_blank(self, value, **kwargs):
        if not value.strip():
            raise ValidationError("Không được để trống.")


class AwardFilterDTO(PaginationFilterDTO):
    search = fields.String(validate=validate.Length(min=1, max=255))
    title = fields.String(validate=validate.Length(min=1, max=255))
    year = fields.Integer(validate=validate.Range(min=1, max=9999))


class AwardResponseDTO(CreateAwardDTO):
    id = fields.String(dump_only=True)
