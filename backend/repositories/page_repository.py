from extensions import db
from models.PageModel import Page


def create_page(data):
    new_page = Page(**data)
    db.session.add(new_page)
    db.session.commit()
    return new_page


def get_page_by_slug(slug):
    return db.session.query(Page).filter_by(slug=slug).first()


def create_founder_hero(page, founder_hero_data):

    page.props = {
        **(page.props or {}),
        "hero_section": founder_hero_data,
    }

    db.session.commit()

    return page
