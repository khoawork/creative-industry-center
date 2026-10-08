from marshmallow import fields
from dto.base_schema import BaseSchema


class ActivityLogResponseDTO(BaseSchema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True, allow_none=True)
    user_name = fields.Str(dump_only=True)
    user_role = fields.Str(dump_only=True)
    action = fields.Str(dump_only=True)
    module = fields.Str(dump_only=True)
    target_id = fields.Int(dump_only=True, allow_none=True)
    summary = fields.Str(dump_only=True)
    changes = fields.Dict(dump_only=True, allow_none=True)
    created_at = fields.Str(dump_only=True, allow_none=True)

