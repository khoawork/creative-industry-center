from marshmallow import fields, validate
from dto.base_schema import BaseSchema


class EventCategoryRequestDTO(BaseSchema):
    name = fields.String(required=True)
    description = fields.String(required=True)


class EventCategoryResponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)


class SpeakerDTO(BaseSchema):
    role = fields.String(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    image = fields.String(required=True)


class EventRequest(BaseSchema):
    name = fields.String(required=True)
    description = fields.String(required=True)
    speakers = fields.List(fields.Nested(SpeakerDTO), required=True)
    location = fields.String(required=True)
    image = fields.String(required=True)
    status = fields.String(
        required=True,
        validate=validate.OneOf(["PENDING", "REGISTRATION_OPEN", "UPCOMING", "ENDED"]),
    )
    btn_action = fields.String(required=True)
    form_url = fields.String(required=True)
    category = fields.Nested(EventCategoryRequestDTO, required=True)


class EventResponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    speakers = fields.List(fields.Nested(SpeakerDTO), required=True)
    location = fields.String(required=True)
    image = fields.String(required=True)
    status = fields.String(
        required=True,
        validate=validate.OneOf(["PENDING", "REGISTRATION_OPEN", "UPCOMING", "ENDED"]),
    )
    btn_action = fields.String(required=True)
    form_url = fields.String(required=True)
    category = fields.Nested(EventCategoryResponse, required=True)
