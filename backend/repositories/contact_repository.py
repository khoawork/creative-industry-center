from sqlalchemy.orm.attributes import flag_modified

from extensions import db
from models.PageModel import Page


def get_contact_page_by_id(page_id):
    return db.session.get(Page, page_id)


def get_contact_page_by_slug():
    return Page.query.filter_by(slug="contact").first()


def update_contact_props(page, props):
    page.props = props
    flag_modified(page, "props")
    db.session.commit()
    return page
