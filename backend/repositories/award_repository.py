from sqlalchemy import extract, func, or_

from extensions import db
from models import Award
from repositories.id_counter_repository import generate_id
from utils.pagination import paginate_query

def get_awards(search=None, title=None, year=None, page=1, per_page=None):
    query = Award.query
    if search is not None:
        query = query.filter(or_(
            Award.name.icontains(search, autoescape=True),
            Award.id.icontains(search, autoescape=True),
        ))
    if title is not None:
        query = query.filter(func.lower(Award.title) == func.lower(title))
    if year is not None:
        query = query.filter(extract("year", Award.created_date) == year)
    return paginate_query(query.order_by(Award.created_date.desc(), Award.id), page, per_page)


def get_awards_by_name(name: str, page=1, per_page=None):
    return get_awards(search=name, page=page, per_page=per_page)

def get_awards_by_title(title: str, page=1, per_page=None):
    return get_awards(title=title, page=page, per_page=per_page)

def get_award(award_id: str):
    return db.session.get(Award, award_id)


def create_award(name, title, description, decision_number, image=None, props=None):
    try:
        award = Award(
            id=generate_id("VK-AWD"),
            name=name,
            title=title,
            description=description,
            decision_number=decision_number,
            image=image,
            props=props,
        )
        db.session.add(award)
        db.session.commit()
        return award
    except Exception:
        db.session.rollback()
        raise


def update_award(award, changes):
    try:
        for field, value in changes.items():
            setattr(award, field, value)
        db.session.commit()
        return award
    except Exception:
        db.session.rollback()
        raise


def delete_award(award):
    try:
        db.session.delete(award)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
