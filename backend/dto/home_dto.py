from marshmallow import fields
from dto import BaseSchema




class ButtonDTO(BaseSchema):
    text = fields.Str(required=True, error_messages={"required": "text của nút là bắt buộc"})
    link = fields.Str(required=True, error_messages={"required": "link của nút là bắt buộc"})


class StatisticItemDTO(BaseSchema):
    value = fields.Str(required=True, error_messages={"required": "value thống kê là bắt buộc"})
    label = fields.Str(required=True, error_messages={"required": "label thống kê là bắt buộc"})


class CoreValueDTO(BaseSchema):
    icon = fields.Str(required=True, error_messages={"required": "icon là bắt buộc"})
    title = fields.Str(required=True, error_messages={"required": "title là bắt buộc"})
    description = fields.Str(required=True, error_messages={"required": "description là bắt buộc"})


class FeaturedImageDTO(BaseSchema):
    url = fields.Str(required=True, error_messages={"required": "url hình ảnh là bắt buộc"})
    caption_title = fields.Str(required=True, error_messages={"required": "caption_title là bắt buộc"})
    caption_text = fields.Str(required=True, error_messages={"required": "caption_text là bắt buộc"})


# ==========================================
# 1. HERO SECTION DTO
# ==========================================

class HeroSectionRequestDTO(BaseSchema):
    badge = fields.Str(required=True, error_messages={"required": "badge là bắt buộc"})
    title_main = fields.Str(required=True, error_messages={"required": "title_main là bắt buộc"})
    subtitle = fields.Str(required=True, error_messages={"required": "subtitle là bắt buộc"})
    quote = fields.Str(required=True, error_messages={"required": "quote là bắt buộc"})
    buttons = fields.List(fields.Nested(ButtonDTO), required=True, error_messages={"required": "danh sách buttons là bắt buộc"})
    statistics = fields.List(fields.Nested(StatisticItemDTO), required=True, error_messages={"required": "danh sách statistics là bắt buộc"})


class HeroSectionResponse(BaseSchema):
    badge = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    subtitle = fields.Str(dump_only=True)
    quote = fields.Str(dump_only=True)
    buttons = fields.List(fields.Nested(ButtonDTO), dump_only=True)
    statistics = fields.List(fields.Nested(StatisticItemDTO), dump_only=True)


# ==========================================
# 2. ABOUT SECTION DTO
# ==========================================

class AboutSectionRequestDTO(BaseSchema):
    tag = fields.Str(required=True, error_messages={"required": "tag là bắt buộc"})
    title_main = fields.Str(required=True, error_messages={"required": "title_main là bắt buộc"})
    featured_image = fields.Nested(FeaturedImageDTO, required=True, error_messages={"required": "featured_image là bắt buộc"})
    core_values = fields.List(fields.Nested(CoreValueDTO), required=True, error_messages={"required": "core_values là bắt buộc"})
    action_button = fields.Nested(ButtonDTO, required=True, error_messages={"required": "action_button là bắt buộc"})


class AboutSectionResponse(BaseSchema):
    tag = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    featured_image = fields.Nested(FeaturedImageDTO, dump_only=True)
    core_values = fields.List(fields.Nested(CoreValueDTO), dump_only=True)
    action_button = fields.Nested(ButtonDTO, dump_only=True)


class NavSectionRequestDTO(BaseSchema):
    id = fields.Int(allow_none=True)
    tag = fields.Str(required=True, error_messages={"required": "tag là bắt buộc"})
    title_main = fields.Str(required=True, error_messages={"required": "title_main là bắt buộc"})
    action_button = fields.Nested(ButtonDTO, required=True, error_messages={"required": "action_button là bắt buộc"})
    children_id = fields.List(fields.Raw(), required=True, error_messages={"required": "children_id là bắt buộc"})

class NavSectionResponse(BaseSchema):
    id = fields.Int(dump_only=True)
    tag = fields.Str(dump_only=True)
    title_main = fields.Str(dump_only=True)
    action_button = fields.Nested(ButtonDTO, dump_only=True)
    children_id = fields.List(fields.Raw(), dump_only=True)
    

# ==========================================
# 6. SUPPORT BANNER SECTION DTO
# ==========================================

class SupportBannerRequestDTO(BaseSchema):
    text = fields.Str(required=True, error_messages={"required": "text banner là bắt buộc"})
    button = fields.Nested(ButtonDTO, required=True, error_messages={"required": "button banner là bắt buộc"})


class SupportBannerResponse(BaseSchema):
    text = fields.Str(dump_only=True)
    button = fields.Nested(ButtonDTO, dump_only=True)


# ==========================================
# 7. TOÀN BỘ TRANG HOME DTO
# ==========================================

class HomeResponse(BaseSchema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    slug = fields.Str(dump_only=True)
    props = fields.Dict(dump_only=True)
    created_date = fields.Str(dump_only=True, allow_none=True)
    updated_date = fields.Str(dump_only=True, allow_none=True)


# ==========================================
# ALIASES CHO TƯƠNG THÍCH NGƯỢC
# ==========================================
ButtonSchema = ButtonDTO
StatisticItemSchema = StatisticItemDTO
CoreValueSchema = CoreValueDTO
FeaturedImageSchema = FeaturedImageDTO
HeroSectionSchema = HeroSectionRequestDTO
AboutSectionSchema = AboutSectionRequestDTO
SupportBannerSchema = SupportBannerRequestDTO