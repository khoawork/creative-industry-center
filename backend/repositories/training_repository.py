from sqlalchemy import func, or_

from extensions import db
from models import Training
from repositories.id_counter_repository import generate_id
from utils.pagination import paginate_query


def get_trainings(search=None, certificate=None, page=1, per_page=None):
    query = Training.query
    if search is not None:
        query = query.filter(or_(
            Training.id.icontains(search, autoescape=True),
            Training.name.icontains(search, autoescape=True),
            Training.certificate.icontains(search, autoescape=True),
        ))
    if certificate is not None:
        query = query.filter(func.lower(Training.certificate) == func.lower(certificate))
    return paginate_query(query.order_by(Training.created_date.desc(), Training.id), page, per_page)


def get_training(training_id: str):
    return db.session.get(Training, training_id)


def create_training(name, time, certificate, props):
    try:
        training = Training(
            id=generate_id("VK"),
            name=name,
            time=time,
            certificate=certificate,
            props=props,
        )
        db.session.add(training)
        db.session.commit()
        return training
    except Exception:
        db.session.rollback()
        raise


def update_training(training, changes):
    try:
        for field, value in changes.items():
            setattr(training, field, value)
        db.session.commit()
        return training
    except Exception:
        db.session.rollback()
        raise


def delete_training(training):
    try:
        db.session.delete(training)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
