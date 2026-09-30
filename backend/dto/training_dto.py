from dto.base_schema import BaseSchema
from marshmallow import fields, validate


class TrainingCategoryDTO(BaseSchema):
    name = fields.String(required=True)
    description = fields.String(required=True)


class TrainingCategoryResponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)


class TrainingInfoDTO(BaseSchema):
    subtext = fields.String(required=True)
    venue = fields.String(required=True)


class TrainingRequest(BaseSchema):
    name = fields.String(required=True)
    time = fields.String(required=True)
    certificate = fields.String(required=True)
    training_info = fields.Nested(TrainingInfoDTO, required=True)
    categories = fields.List(
        fields.Nested(TrainingCategoryDTO),
        required=True,
        validate=validate.Length(min=1, error="At least one category is required"),
    )


class TrainingReponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    time = fields.String(required=True)
    certificate = fields.String(required=True)
    training_info = fields.Nested(TrainingInfoDTO, required=True)
    categories = fields.List(fields.Nested(TrainingCategoryDTO), required=True)
