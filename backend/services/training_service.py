from repositories import training_repository
from utils.error import NotFoundError, ValidationError


def get_trainings(search=None, certificate=None, page=1, per_page=None):
    return training_repository.get_trainings(
        search=search, certificate=certificate, page=page, per_page=per_page
    )


def get_training(training_id: str):
    training = training_repository.get_training(training_id)
    if training is None:
        raise NotFoundError("Không tìm thấy khóa học.")
    return training


def create_training(dto):
    return training_repository.create_training(**vars(dto))


def update_training(training_id: str, dto, partial=False):
    training = get_training(training_id)
    changes = vars(dto)
    if not changes:
        raise ValidationError("Cần ít nhất một trường để cập nhật.")
    if partial and changes.get("props") is not None:
        changes["props"] = {**(training.props or {}), **changes["props"]}
    return training_repository.update_training(training, changes)


def delete_training(training_id: str):
    training_repository.delete_training(get_training(training_id))
