from marshmallow import Schema, ValidationError, fields, pre_load, validate, validates_schema
from dto.base_schema import BaseSchema
from datetime import date


class EventCategoryRequestDTO(BaseSchema):
    name = fields.String(required=True)
    description = fields.String(load_default="", allow_none=True)


class EventCategoryResponse(BaseSchema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(allow_none=True)


class SpeakerDTO(BaseSchema):
    role = fields.String(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    image = fields.String(required=True)


class EventRequest(BaseSchema):
    event_date = fields.Date(required=False, allow_none=True, validate=validate.Range(min=date(1000, 1, 1)))
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
    category_id = fields.Integer(required=False, allow_none=True)
    category = fields.Nested(
        EventCategoryRequestDTO, required=False, allow_none=True
    )


class EventResponse(BaseSchema):
    event_date = fields.Date(dump_only=True, allow_none=True)
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    speakers = fields.List(fields.Dict(), attribute="speaker", dump_only=True)
    location = fields.String(required=True)
    image = fields.String(required=True)
    status = fields.Method("get_status", dump_only=True)
    btn_action = fields.String(required=True)
    form_url = fields.String(required=True)
    category = fields.Nested(EventCategoryResponse, required=True)

    def get_status(self, event):
        return getattr(event.status, "value", event.status)


def _not_blank(value):
    if not value.strip():
        raise ValidationError("Không được để trống.")


def _page_link(value):
    if any(char.isspace() for char in value) or "\\" in value:
        raise ValidationError("Đường dẫn không hợp lệ.")
    if value.startswith("/") and not value.startswith("//"):
        return
    validate.URL(schemes={"http", "https"}, require_tld=False)(value)


class EventPageStatisticDTO(Schema):
    icon = fields.String(required=True, validate=validate.OneOf(["calendar", "users", "certificate", "building"]))
    value = fields.String(required=True, validate=_not_blank)
    label = fields.String(required=True, validate=_not_blank)


class EventPageBreadcrumbDTO(Schema):
    text = fields.String(required=True, validate=_not_blank)
    link = fields.String(load_default=None, allow_none=True, validate=_page_link)


class EventPageHeroDTO(Schema):
    breadcrumbs = fields.List(fields.Nested(EventPageBreadcrumbDTO), load_default=list, validate=validate.Length(max=8))
    badge = fields.String(required=True, validate=_not_blank)
    title = fields.String(required=True, validate=_not_blank)
    description = fields.String(required=True, validate=_not_blank)
    statistics = fields.List(fields.Nested(EventPageStatisticDTO), required=True, validate=validate.Length(max=8))


class EventPageStatusFilterDTO(Schema):
    statuses = fields.List(
        fields.String(validate=validate.OneOf(["ALL", "PENDING", "REGISTRATION_OPEN", "UPCOMING", "ENDED"])),
        required=True,
        validate=validate.Length(min=1, max=4),
    )
    label = fields.String(required=True, validate=_not_blank)

    @pre_load
    def migrate_single_status(self, data, **kwargs):
        if not isinstance(data, dict):
            return data
        data = dict(data)
        legacy_status = data.pop("status", None)
        if "statuses" not in data and legacy_status:
            data["statuses"] = [legacy_status]
        return data

    @validates_schema
    def validate_unique_statuses(self, data, **kwargs):
        statuses = data["statuses"]
        if len(statuses) != len(set(statuses)):
            raise ValidationError({"statuses": "Trạng thái trong một bộ lọc không được trùng nhau."})
        if "ALL" in statuses and len(statuses) > 1:
            raise ValidationError({"statuses": "Bộ lọc tất cả sự kiện không kết hợp với trạng thái khác."})


class EventPageFilterDTO(Schema):
    status_filters = fields.List(
        fields.Nested(EventPageStatusFilterDTO),
        load_default=list,
        validate=validate.Length(max=8),
    )
    search_placeholder = fields.String(required=True, validate=_not_blank)
    show_year_filter = fields.Boolean(load_default=True)
    all_label = fields.String(required=False, load_only=True)
    upcoming_label = fields.String(required=False, load_only=True)
    registration_open_label = fields.String(required=False, load_only=True)

class EventPageDisplayDTO(Schema):
    event_ids = fields.List(
        fields.Integer(validate=validate.Range(min=1)),
        required=True,
        validate=validate.Length(max=1000),
    )


class EventPageNewsletterDTO(Schema):
    tag = fields.String(required=True, validate=_not_blank)
    title = fields.String(required=True, validate=_not_blank)
    description = fields.String(required=True, validate=_not_blank)
    privacy_text = fields.String(required=True, validate=_not_blank)
    button_text = fields.String(required=True, validate=_not_blank)
    registration_url = fields.String(required=False, validate=_page_link)
    full_name_label = fields.String(required=True, validate=_not_blank)
    full_name_placeholder = fields.String(required=True, validate=_not_blank)
    organization_label = fields.String(required=True, validate=_not_blank)
    organization_placeholder = fields.String(required=True, validate=_not_blank)
    email_label = fields.String(required=True, validate=_not_blank)
    email_placeholder = fields.String(required=True, validate=_not_blank)
    consent_text = fields.String(required=True, validate=_not_blank)
    success_message = fields.String(required=True, validate=_not_blank)


class EventNewsletterSubscriptionDTO(Schema):
    full_name = fields.String(required=True, validate=[_not_blank, validate.Length(max=255)])
    organization = fields.String(load_default="", validate=validate.Length(max=255))
    email = fields.Email(required=True, validate=validate.Length(max=254))
    consent = fields.Boolean(required=True, validate=validate.Equal(True, error="Vui lòng đồng ý nhận thông tin sự kiện."))
