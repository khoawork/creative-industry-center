from extensions import db
from models.PageModel import Page


def get_page_by_slug(slug):
    return Page.query.filter_by(slug=slug).first()


def create_page(name, slug, props):
    page = Page(name=name, slug=slug, props=props)
    db.session.add(page)
    db.session.commit()
    return page


def save_page(page):
    db.session.add(page)
    db.session.commit()
    return page
