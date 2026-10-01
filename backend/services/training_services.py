from dto import training_dto

from repositories import training_repository as training_repo


def is_unique_name(**kwargs) -> bool:
    name = kwargs.get("name")
    training_id = kwargs.get("training_id")
    category_id = kwargs.get("category_id")

    if not name:
        raise ValueError("Name is required")

    # Check Training
    existing_training = training_repo.get_training_by_name(name)

    if existing_training:
        if not training_id or existing_training.id != training_id:
            return False

    # Check Training Category
    existing_category = training_repo.get_training_category_by_name(name)

    if existing_category:
        if not category_id or existing_category.id != category_id:
            return False

    return True


def get_all_training_categories() -> list[training_dto.TrainingCategoryResponse]:
    categories = training_repo.get_all_training_categories()

    return categories


def create_training_category(
    category_dto: training_dto.TrainingCategoryDTO,
) -> training_dto.TrainingCategoryResponse:

    if not category_dto:
        raise ValueError("Category data is required")

    is_unique = is_unique_name(name=category_dto.name)
    if not is_unique:
        raise ValueError("Category name must be unique")

    category = training_repo.create_training_category(category_dto)

    return category


def get_all_trainings() -> list[training_dto.TrainingReponse]:
    trainings = training_repo.get_all_trainings()

    return trainings


def create_training(
    training_dto: training_dto.TrainingRequest,
) -> training_dto.TrainingReponse:

    if not training_dto:
        raise ValueError("Training data is required")

    if not training_dto.categories:
        raise ValueError("At least one category is required")

    is_unique = is_unique_name(name=training_dto.name)
    if not is_unique:
        raise ValueError("Training name must be unique")

    training = training_repo.create_training(training_dto)

    if training_dto.categories:
        for category_dto in training_dto.categories:
            category = create_training_category(category_dto)
            training.categories.append(category)

    return training


def get_trainings(
    training_dto: training_dto.TrainingRequest,
) -> list[training_dto.TrainingReponse]:

    if not training_dto:
        raise ValueError("Training data is required")

    trainings = training_repo.get_all_trainings()

    return trainings


def update_training(
    training_id: int, training_dto: training_dto.TrainingRequest
) -> training_dto.TrainingReponse:

    if not training_id or training_id <= 0:
        raise ValueError("Training ID must be greater than 0")

    if not training_dto:
        raise ValueError("Training data is required")

    if not training_dto.categories:
        raise ValueError("At least one category is required")

    training = training_repo.get_training_by_id(training_id)

    if not training:
        raise ValueError("Training not found")

    training = training_repo.update_training(training_id, training_dto)

    return training


def delete_training(training_id: int) -> bool:

    if not training_id or training_id <= 0:
        raise ValueError("Training ID must be greater than 0")

    training = training_repo.get_training_by_id(training_id)

    if not training:
        raise ValueError("Training not found")

    return training_repo.delete_training(training_id)
