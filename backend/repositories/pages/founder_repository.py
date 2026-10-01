from extensions import db
from models.PageModel import Page


def get_page_by_slug(slug):
    return db.session.query(Page).filter_by(slug=slug).first()


def create_founder_hero(page, founder_hero_data):
    page.props["hero_section"] = founder_hero_data
    db.session.add(page)
    db.session.commit()
    return page


# repositories/page_repository.py

from models import Page
from extensions import db


def get_page_by_slug(slug):
    return Page.query.filter_by(slug=slug).first()


def get_page_by_id(page_id):
    return Page.query.get(page_id)


def save_page(page):
    db.session.commit()
    return page


def create_page(page_data):
    page = Page(
        name=page_data["name"],
        slug=page_data["slug"],
        props=page_data.get("props", {}),
    )

    db.session.add(page)
    db.session.commit()

    return page


def delete_page(page):
    db.session.delete(page)
    db.session.commit()
