from flask import current_app
from marshmallow import Schema, ValidationError, fields, validate, validates


class PaginationFilterDTO(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(
        load_default=lambda: current_app.config["DEFAULT_PAGE_SIZE"],
        validate=validate.Range(min=1),
    )

    @validates("per_page")
    def validate_page_size(self, value, **kwargs):
        maximum = current_app.config["MAX_PAGE_SIZE"]
        if value > maximum:
            raise ValidationError(f"Không được vượt quá {maximum} bản ghi mỗi trang.")
