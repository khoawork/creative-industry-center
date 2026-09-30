from extensions import db
from models.TrainingModel import Training, TrainingCategory
from dto import training_dto

# Training Category functions for CRUD operations on Training


def create_training_category(
    category_dto: TrainingCategory,
) -> TrainingCategory:

    category = TrainingCategory(
        name=category_dto.name, description=category_dto.description
    )

    db.session.add(category)
    db.session.commit()

    return category


def get_training_category_by_name(name: str) -> TrainingCategory:
    return TrainingCategory.query.filter_by(name=name).first()


def get_training_by_name(name: str) -> Training:
    return Training.query.filter_by(name=name).first()


def get_training_category_by_id(category_id: int) -> TrainingCategory:
    return TrainingCategory.query.get(category_id)


def get_all_training_categories() -> list[TrainingCategory]:

    return TrainingCategory.query.all()


def create_training(training_dto: Training) -> Training:

    training = Training(
        name=training_dto.name,
        time=training_dto.time,
        certificate=training_dto.certificate,
        training_info={
            "subtext": training_dto.training_info.subtext,
            "venue": training_dto.training_info.venue,
        },
    )

    return training


def get_training_by_id(training_id: int) -> Training:

    return Training.query.get(training_id)


def get_all_trainings() -> list[Training]:

    return Training.query.all()


def delete_training(training_id: int) -> bool:

    training = Training.query.get(training_id)
    if training:
        db.session.delete(training)
        db.session.commit()
        return True
    return False


def update_training(training_id: int, training_dto: Training) -> Training:

    training = Training.query.get(training_id)
    if not training:
        return None

    training.title = training_dto.title
    training.description = training_dto.description
    training.category_id = training_dto.category_id
    training.start_date = training_dto.start_date
    training.end_date = training_dto.end_date
    training.location = training_dto.location
    training.instructor = training_dto.instructor

    db.session.commit()
    return training
