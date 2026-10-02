from marshmallow import ValidationError, fields, validate

from dto.base_schema import BaseSchema


def _not_blank(value):
    if not value.strip():
        raise ValidationError("Không được để trống hoặc chỉ chứa khoảng trắng.")


_http_url = validate.URL(schemes={"http", "https"}, require_tld=False)


def _validate_link(value):
    if not value or any(char.isspace() for char in value) or "\\" in value:
        raise ValidationError("Đường dẫn không được rỗng, chứa khoảng trắng hoặc dấu gạch chéo ngược.")
    if value.startswith("/") and not value.startswith("//"):
        return
    _http_url(value)


class BreadcrumbItemDTO(BaseSchema):
    text = fields.Str(required=True, validate=_not_blank)
    link = fields.Str(required=True, allow_none=True, validate=_validate_link)


class IntroduceButtonDTO(BaseSchema):
    text = fields.Str(required=True, validate=_not_blank)
    link = fields.Str(required=True, validate=_validate_link)
    icon = fields.Str(load_default="")


class IntroduceStatisticDTO(BaseSchema):
    value = fields.Str(required=True, validate=_not_blank)
    label = fields.Str(required=True, validate=_not_blank)
    icon = fields.Str(load_default="")


class IntroduceImageDTO(BaseSchema):
    url = fields.Str(required=True, validate=_validate_link)
    alt = fields.Str(required=True, validate=_not_blank)
    tag = fields.Str(load_default="")
    caption_title = fields.Str(required=True, validate=_not_blank)


class IntroduceItemDTO(BaseSchema):
    icon = fields.Str(required=True, validate=_not_blank)
    title = fields.Str(required=True, validate=_not_blank)
    description = fields.Str(required=True, validate=_not_blank)


class HeroSectionRequestDTO(BaseSchema):
    breadcrumbs = fields.List(
        fields.Nested(BreadcrumbItemDTO), required=True, validate=validate.Length(min=1)
    )
    title_main = fields.Str(required=True, validate=_not_blank)
    quote = fields.Str(required=True, validate=_not_blank)
    quote_author = fields.Str(load_default="")


class HeroSectionResponse(BaseSchema):
    breadcrumbs = fields.List(fields.Nested(BreadcrumbItemDTO), dump_only=True)
    title_main = fields.Str(dump_only=True)
    quote = fields.Str(dump_only=True)
    quote_author = fields.Str(dump_only=True)


class OverviewSectionRequestDTO(BaseSchema):
    tag = fields.Str(required=True, validate=_not_blank)
    title_main = fields.Str(required=True, validate=_not_blank)
    paragraphs = fields.List(
        fields.Str(validate=_not_blank), required=True, validate=validate.Length(min=1)
    )
    featured_image = fields.Nested(IntroduceImageDTO, required=True)
    statistics = fields.List(fields.Nested(IntroduceStatisticDTO), required=True)


class OverviewSectionResponse(BaseSchema):
    tag = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    paragraphs = fields.List(fields.Str(), dump_only=True)
    featured_image = fields.Nested(IntroduceImageDTO, dump_only=True)
    statistics = fields.List(fields.Nested(IntroduceStatisticDTO), dump_only=True)


class VisionSectionRequestDTO(BaseSchema):
    tag = fields.Str(required=True, validate=_not_blank)
    title_main = fields.Str(required=True, validate=_not_blank)
    paragraphs = fields.List(
        fields.Str(validate=_not_blank), required=True, validate=validate.Length(min=1)
    )
    featured_image = fields.Nested(IntroduceImageDTO, required=True)
    items = fields.List(
        fields.Nested(IntroduceItemDTO), required=True, validate=validate.Length(min=1)
    )


class VisionSectionResponse(BaseSchema):
    tag = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    paragraphs = fields.List(fields.Str(), dump_only=True)
    featured_image = fields.Nested(IntroduceImageDTO, dump_only=True)
    items = fields.List(fields.Nested(IntroduceItemDTO), dump_only=True)


class MissionSectionRequestDTO(BaseSchema):
    tag = fields.Str(required=True, validate=_not_blank)
    title_main = fields.Str(required=True, validate=_not_blank)
    featured_image = fields.Nested(IntroduceImageDTO, required=True)
    items = fields.List(
        fields.Nested(IntroduceItemDTO), required=True, validate=validate.Length(min=1)
    )


class MissionSectionResponse(BaseSchema):
    tag = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    featured_image = fields.Nested(IntroduceImageDTO, dump_only=True)
    items = fields.List(fields.Nested(IntroduceItemDTO), dump_only=True)


class CoreValuesSectionRequestDTO(BaseSchema):
    tag = fields.Str(required=True, validate=_not_blank)
    title_main = fields.Str(required=True, validate=_not_blank)
    description = fields.Str(required=True, validate=_not_blank)
    items = fields.List(
        fields.Nested(IntroduceItemDTO), required=True, validate=validate.Length(min=1)
    )


class CoreValuesSectionResponse(BaseSchema):
    tag = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    items = fields.List(fields.Nested(IntroduceItemDTO), dump_only=True)


class ActionsSectionRequestDTO(BaseSchema):
    buttons = fields.List(
        fields.Nested(IntroduceButtonDTO), required=True, validate=validate.Length(min=1)
    )


class ActionsSectionResponse(BaseSchema):
    buttons = fields.List(fields.Nested(IntroduceButtonDTO), dump_only=True)


class IntroduceResponse(BaseSchema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    props = fields.Dict(dump_only=True)