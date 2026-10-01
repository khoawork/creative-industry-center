from marshmallow import fields, validate
from dto.base_schema import BaseSchema


class FounderHeroSectionDto(BaseSchema):
    title = fields.String(required=True)
    description = fields.String(required=True)
    name = fields.String(required=True)
    number_of_founders = fields.Integer(required=True)
    subtitle = fields.String(required=True)
    subdescription = fields.String(required=True)


class FounderHeroSectionResponseDto(BaseSchema):
    id = fields.String(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)
    name = fields.String(required=True)
    number_of_founders = fields.Integer(required=True)
    subtitle = fields.String(required=True)
    subdescription = fields.String(required=True)


# thông tin về chức danh
class FounderInfoDto(BaseSchema):
    label = fields.String(required=True)
    value = fields.String(required=True)


class FounderInfoResponseDto(BaseSchema):
    id = fields.String(required=True)
    label = fields.String(required=True)
    value = fields.String(required=True)


# thông tin về profile của founder
class FounderProfileDto(BaseSchema):
    filter = fields.String(
        required=True, validate=validate.OneOf(["bio", "projects", "achievements"])
    )
    title = fields.String(required=True)
    description = fields.String(required=True)
    slogan = fields.String(required=True)
    sub_slogan = fields.String(required=True)


class FounderProfileResponseDto(BaseSchema):
    id = fields.String(required=True)
    filter = fields.String(
        required=True, validate=validate.OneOf(["bio", "projects", "achievements"])
    )
    title = fields.String(required=True)
    description = fields.String(required=True)
    slogan = fields.String(required=True)
    sub_slogan = fields.String(required=True)


class FounderSectionDto(BaseSchema):
    major = fields.String(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    founder_info = fields.List(fields.Nested(FounderInfoDto), required=True)
    is_verified = fields.Boolean(required=True)
    image = fields.String(required=True)
    founder_profile = fields.Nested(FounderProfileDto, required=True)


class FounderSectionResponseDto(BaseSchema):
    id = fields.String(required=True)
    major = fields.String(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    founder_info = fields.List(fields.Nested(FounderInfoResponseDto), required=True)
    is_verified = fields.Boolean(required=True)
    image = fields.String(required=True)
    founder_profile = fields.Nested(FounderProfileResponseDto, required=True)


class FounderCertificateDto(BaseSchema):
    name = fields.String(required=True)


class FounderCertificateResponseDto(BaseSchema):
    id = fields.String(required=True)
    name = fields.String(required=True)


class FounderCTADto(BaseSchema):
    subtitle = fields.String(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)

    btn_cta = fields.String(required=True)
    sub_btn_cta = fields.String(required=True)

    certificate = fields.List(fields.Nested(FounderCertificateDto), required=True)


class FounderCTAResponseDto(BaseSchema):
    id = fields.String(required=True)
    subtitle = fields.String(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)

    btn_cta = fields.String(required=True)
    sub_btn_cta = fields.String(required=True)
    form_url = fields.String(required=True)

    certificate = fields.List(
        fields.Nested(FounderCertificateResponseDto), required=True
    )


class FounderPropsDto(BaseSchema):
    hero_section = fields.Nested(FounderHeroSectionDto, required=True)
    section = fields.List(fields.Nested(FounderSectionDto), required=True)
    cta_section = fields.Nested(FounderCTADto, required=True)


class FounderPropsResponseDto(BaseSchema):
    id = fields.String(required=True)
    hero_section = fields.Nested(FounderHeroSectionResponseDto, required=True)
    section = fields.List(fields.Nested(FounderSectionResponseDto), required=True)
    cta_section = fields.Nested(FounderCTAResponseDto, required=True)


class FounderRequestPageDto(BaseSchema):
    name = fields.String(required=True)
    slug = fields.String(required=True)
    props = fields.Nested(FounderPropsDto, required=True)


class FounderResponsePageDto(BaseSchema):
    id = fields.String(required=True)
    name = fields.String(required=True)
    slug = fields.String(required=True)
    props = fields.Nested(FounderPropsResponseDto, required=True)
