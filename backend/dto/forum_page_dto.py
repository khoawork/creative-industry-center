from marshmallow import fields
from dto.base_schema import BaseSchema


class ForumNavItemDTO(BaseSchema):
    label = fields.Str(required=True)
    href = fields.Str(required=True)


class ForumHeaderDTO(BaseSchema):
    top_back_text = fields.Str(allow_none=True)
    top_back_link = fields.Str(allow_none=True)
    top_slogan = fields.Str(allow_none=True)
    top_hotline = fields.Str(allow_none=True)
    logo_image = fields.Str(allow_none=True)
    brand_title = fields.Str(allow_none=True)
    brand_subtitle = fields.Str(allow_none=True)
    nav_items = fields.List(fields.Nested(ForumNavItemDTO), allow_none=True, load_default=[])
    button_text = fields.Str(allow_none=True)
    button_link = fields.Str(allow_none=True)
    show_user_icon = fields.Bool(allow_none=True, load_default=True)


class ForumHeroDTO(BaseSchema):
    badge = fields.Str(allow_none=True)
    title = fields.Str(allow_none=True)
    subtitle = fields.Str(allow_none=True)
    motto = fields.Str(allow_none=True)
    event_date = fields.Str(allow_none=True)
    event_location = fields.Str(allow_none=True)
    top_logo_image = fields.Str(allow_none=True)
    banner_image = fields.Str(allow_none=True)
    primary_button_text = fields.Str(allow_none=True)
    primary_button_link = fields.Str(allow_none=True)
    secondary_button_text = fields.Str(allow_none=True)
    secondary_button_link = fields.Str(allow_none=True)


class PillarItemDTO(BaseSchema):
    id = fields.Raw(allow_none=True)
    pillar_no = fields.Str(allow_none=True)
    title = fields.Str(required=True, error_messages={"required": "tiêu đề trụ cột là bắt buộc"})
    description = fields.Str(allow_none=True)
    tag = fields.Str(allow_none=True)
    icon = fields.Str(allow_none=True)
    action_text = fields.Str(allow_none=True)
    action_link = fields.Str(allow_none=True)


class ForumPillarsDTO(BaseSchema):
    tag = fields.Str(allow_none=True)
    title = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    pillars = fields.List(fields.Nested(PillarItemDTO), allow_none=True, load_default=[])


class SpeakerItemDTO(BaseSchema):
    id = fields.Raw(allow_none=True)
    name = fields.Str(required=True, error_messages={"required": "tên diễn giả là bắt buộc"})
    role = fields.Str(allow_none=True)
    topic = fields.Str(allow_none=True)
    image = fields.Str(allow_none=True)
    icon = fields.Str(allow_none=True)
    icon_badge = fields.Str(allow_none=True)


class ForumSpeakersDTO(BaseSchema):
    tag = fields.Str(allow_none=True)
    title = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    speakers = fields.List(fields.Nested(SpeakerItemDTO), allow_none=True, load_default=[])


class SessionItemDTO(BaseSchema):
    id = fields.Raw(allow_none=True)
    session_no = fields.Str(allow_none=True)
    location = fields.Str(allow_none=True)
    hall_icon = fields.Str(allow_none=True)
    title = fields.Str(required=True, error_messages={"required": "tiêu đề phiên là bắt buộc"})
    description = fields.Str(allow_none=True)
    tags = fields.List(fields.Str(), allow_none=True, load_default=[])
    accent_color = fields.Str(allow_none=True)


class ForumAgendaDTO(BaseSchema):
    tag = fields.Str(allow_none=True)
    title = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    certificate_title = fields.Str(allow_none=True)
    certificate_subtitle = fields.Str(allow_none=True)
    sessions = fields.List(fields.Nested(SessionItemDTO), allow_none=True, load_default=[])


class ForumAwardsDTO(BaseSchema):
    tag = fields.Str(allow_none=True)
    title = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    award_ids = fields.List(fields.Raw(), allow_none=True, load_default=[])


class PartnerItemDTO(BaseSchema):
    name = fields.Str(required=True)
    desc = fields.Str(allow_none=True)
    tier = fields.Str(allow_none=True)
    icon = fields.Str(allow_none=True)
    image = fields.Str(allow_none=True)


class ForumPartnersDTO(BaseSchema):
    organizers_tag = fields.Str(allow_none=True)
    organizers = fields.List(fields.Nested(PartnerItemDTO), allow_none=True, load_default=[])
    sponsors_tag = fields.Str(allow_none=True)
    sponsors = fields.List(fields.Nested(PartnerItemDTO), allow_none=True, load_default=[])


class ForumRegistrationDTO(BaseSchema):
    tag = fields.Str(allow_none=True)
    title = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    hotline = fields.Str(allow_none=True)
    email = fields.Str(allow_none=True)
    address = fields.Str(allow_none=True)
    privacy_text = fields.Str(allow_none=True)
    button_text = fields.Str(allow_none=True)
    form_fields = fields.List(fields.Dict(), allow_none=True, load_default=[])


class ForumPageResponseDTO(BaseSchema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    props = fields.Dict(dump_only=True)
    created_date = fields.Str(dump_only=True, allow_none=True)
    updated_date = fields.Str(dump_only=True, allow_none=True)


class ForumPageRequestDTO(BaseSchema):
    name = fields.Str(allow_none=True)
    slug = fields.Str(allow_none=True)
    props = fields.Dict(allow_none=True)
