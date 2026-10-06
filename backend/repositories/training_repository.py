import re
from sqlalchemy import func, or_

from extensions import db
from models import Training
from utils.pagination import paginate_query


def _generate_training_id():
    trainings = Training.query.with_entities(Training.id).all()
    max_num = 0
    for (t_id,) in trainings:
        if t_id:
            match = re.match(r"^VK-(\d+)$", str(t_id).strip(), re.IGNORECASE)
            if match:
                num = int(match.group(1))
                if num > max_num:
                    max_num = num
    next_num = max_num + 1
    return f"VK-{next_num:02d}"


def get_trainings(search=None, certificate=None, page=1, per_page=None):
    query = Training.query
    if search is not None:
        query = query.filter(
            or_(
                Training.id.icontains(search, autoescape=True),
                Training.name.icontains(search, autoescape=True),
                Training.certificate.icontains(search, autoescape=True),
            )
        )
    if certificate is not None:
        query = query.filter(
            func.lower(Training.certificate) == func.lower(certificate)
        )
    return paginate_query(
        query.order_by(Training.created_date.desc(), Training.id), page, per_page
    )


def get_training(training_id: str):
    return db.session.get(Training, training_id)


def create_training(name, time, certificate, props, id=None):
    try:
        custom_id = id.strip() if id and isinstance(id, str) and id.strip() else _generate_training_id()
        training = Training(
            id=custom_id,
            name=name,
            time=time,
            certificate=certificate,
            props=props or {},
        )
        db.session.add(training)
        db.session.commit()
        return training
    except Exception:
        db.session.rollback()
        raise


def update_training(training, changes):
    try:
        from sqlalchemy.orm.attributes import flag_modified
        for field, value in changes.items():
            if field != "id":
                setattr(training, field, value)
        flag_modified(training, "props")
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
