import re

from marshmallow import Schema, ValidationError, fields, validate


def _not_blank(value):
    if not value or not value.strip():
        raise ValidationError("Không được để trống.")


def _phone_format(value):
    text = str(value or '').strip()
    digits = re.sub(r'[^0-9]', '', text)
    compact = re.sub(r'[ ().-]', '', text)
    balanced = 0
    for char in text:
        if char == '(':
            balanced += 1
        elif char == ')':
            balanced -= 1
        if balanced < 0 or balanced > 1:
            raise ValidationError("Số điện thoại không đúng định dạng.")
    if (not re.fullmatch(r'[+0-9 ().-]+', text)
            or not re.fullmatch(r'\+?[0-9]{7,15}', compact)
            or not 7 <= len(digits) <= 15 or balanced):
        raise ValidationError("Số điện thoại không đúng định dạng.")


def _tel_href_format(value):
    if not re.fullmatch(r'tel:\+?[0-9]{7,15}', str(value or '').strip()):
        raise ValidationError("Đường dẫn điện thoại phải có dạng tel:+842838477777.")


class ContactIntroDTO(Schema):
    badge = fields.Str(required=True, validate=_not_blank)
    title = fields.Str(required=True, validate=_not_blank)
    description = fields.Str(required=True, validate=_not_blank)


class ContactPhoneDTO(Schema):
    number = fields.Str(required=True, validate=_phone_format)
    href = fields.Str(required=True, validate=_tel_href_format)


class ContactDetailsDTO(Schema):
    organization = fields.Str(required=True, validate=_not_blank)
    address = fields.Str(required=True, validate=_not_blank)
    phone = fields.Str(required=True, validate=_phone_format)
    phoneHref = fields.Str(required=True, validate=_tel_href_format)
    phones = fields.List(fields.Nested(ContactPhoneDTO), load_default=list, dump_default=list, validate=validate.Length(min=1))
    emails = fields.List(fields.Email(), required=True, validate=validate.Length(min=1))


class ContactOfficeDTO(Schema):
    id = fields.Str(required=True, validate=_not_blank)
    label = fields.Str(required=True, validate=_not_blank)
    city = fields.Str(required=True, validate=_not_blank)
    address = fields.Str(required=True, validate=_not_blank)


class ContactWorkingHourDTO(Schema):
    days = fields.Str(required=True, validate=_not_blank)
    time = fields.Str(required=True, validate=_not_blank)


class ContactChannelDTO(Schema):
    id = fields.Str(required=True, validate=_not_blank)
    label = fields.Str(required=True, validate=_not_blank)
    href = fields.Str(allow_none=True, load_default=None)


class ContactMapDTO(Schema):
    label = fields.Str(required=True, validate=_not_blank)
    office = fields.Nested(ContactOfficeDTO, required=True)
    address = fields.Str(required=True, validate=_not_blank)
    mapAddress = fields.Str(required=True, validate=_not_blank)
    embedUrl = fields.URL(required=True, require_tld=False)
    directionsUrl = fields.URL(allow_none=True, load_default=None, require_tld=False)


class ContactCategoryDTO(Schema):
    value = fields.Str(required=True, validate=_not_blank)
    label = fields.Str(required=True, validate=_not_blank)


class ContactFormFieldDTO(Schema):
    id = fields.Str(required=True, validate=_not_blank)
    label = fields.Str(required=True, validate=_not_blank)
    placeholder = fields.Str(load_default="")
    type = fields.Str(load_default="text", validate=validate.OneOf(["text", "tel", "email", "number", "textarea", "select"]))
    options = fields.List(fields.Str(), load_default=list)
    required = fields.Bool(load_default=False)
    width = fields.Str(load_default="full", validate=validate.OneOf(["full", "half"]))


class ContactFormDTO(Schema):
    form_title = fields.Str(required=True, validate=_not_blank)
    form_description = fields.Str(required=True, validate=_not_blank)
    button_text = fields.Str(required=True, validate=_not_blank)
    availability_text = fields.Str(required=True, validate=_not_blank)
    privacy_text = fields.Str(required=True, validate=_not_blank)
    form_fields = fields.List(fields.Nested(ContactFormFieldDTO), required=True)


class ContactPagePropsDTO(Schema):
    intro = fields.Nested(ContactIntroDTO, required=True)
    contact = fields.Nested(ContactDetailsDTO, required=True)
    offices = fields.List(fields.Nested(ContactOfficeDTO), required=True, validate=validate.Length(min=1))
    workingHours = fields.List(fields.Nested(ContactWorkingHourDTO), required=True, validate=validate.Length(min=1))
    socialChannels = fields.List(fields.Nested(ContactChannelDTO), required=True)
    mapLocation = fields.Nested(ContactMapDTO, required=True)
    contactCategories = fields.List(fields.Nested(ContactCategoryDTO), required=True, validate=validate.Length(min=1))
    form = fields.Nested(ContactFormDTO, required=True)


class ContactPageResponse(Schema):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    slug = fields.Str(required=True)
    props = fields.Nested(ContactPagePropsDTO, required=True)
