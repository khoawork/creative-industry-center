from marshmallow import fields, validate
from dto.base_schema import BaseSchema
from models.UserModel import RoleEnum


class UserCreateRequestDTO(BaseSchema):
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={"required": "Tên đăng nhập (username) là bắt buộc."}
    )
    email = fields.Email(
        required=True,
        validate=validate.Length(max=100),
        error_messages={"required": "Email là bắt buộc.", "invalid": "Email không đúng định dạng."}
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=6),
        error_messages={"required": "Mật khẩu là bắt buộc."}
    )
    full_name = fields.Str(required=False, allow_none=True, validate=validate.Length(max=100))
    role = fields.Str(
        required=False,
        load_default=RoleEnum.MANAGER.value,
        validate=validate.OneOf([RoleEnum.ADMIN.value, RoleEnum.MANAGER.value])
    )


class UserUpdateRequestDTO(BaseSchema):
    email = fields.Email(required=False, allow_none=True, validate=validate.Length(max=100))
    full_name = fields.Str(required=False, allow_none=True, validate=validate.Length(max=100))
    password = fields.Str(required=False, allow_none=True, validate=validate.Length(min=6))
    role = fields.Str(
        required=False,
        allow_none=True,
        validate=validate.OneOf([RoleEnum.ADMIN.value, RoleEnum.MANAGER.value])
    )


class UserResponseDTO(BaseSchema):
    id = fields.Int(dump_only=True)
    username = fields.Str(dump_only=True)
    email = fields.Str(dump_only=True)
    full_name = fields.Str(dump_only=True)
    avatar = fields.Str(dump_only=True)
    role = fields.Str(dump_only=True)
    is_active = fields.Bool(dump_only=True)
    can_admin_access = fields.Bool(dump_only=True)
    last_login_at = fields.Str(dump_only=True, allow_none=True)
    created_date = fields.Str(dump_only=True, allow_none=True)


class UserLoginRequestDTO(BaseSchema):
    username = fields.Str(required=True, error_messages={"required": "Vui lòng nhập tên đăng nhập hoặc email."})
    password = fields.Str(required=True, error_messages={"required": "Vui lòng nhập mật khẩu."})

