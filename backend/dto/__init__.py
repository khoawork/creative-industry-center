from dto.base_schema import BaseSchema
from dto.training_dto import (
    TrainingInfoDTO,
    TrainingCategoryDTO,
    TrainingReponse,
    TrainingRequest,
    TrainingCategoryResponse,
)
import typing
from types import SimpleNamespace

from marshmallow import Schema, post_load, ValidationError

__all__ = [
    "BaseSchema",
    "TrainingInfoDTO",
    "TrainingCategoryDTO",
    "TrainingReponse",
    "TrainingRequest",
    "TrainingCategoryResponse",
]

class BaseSchema(Schema):
    @post_load
    def make_object(self, data, **kwargs):
        return SimpleNamespace(**data)

    def handle_error(self, error: ValidationError, data: typing.Any, *, many: bool, **kwargs):
        for field, message in error.messages.items():
            if isinstance(message, list) and len(message) > 0:
                error.messages[field] = message[0]

        raise error