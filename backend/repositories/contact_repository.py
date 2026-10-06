from sqlalchemy.orm.attributes import flag_modified

from extensions import db
from models.PageModel import Page


def get_contact_page(page_id=None):
    query = Page.query.filter_by(slug="contact")
    if page_id is not None:
        query = query.filter_by(id=page_id)
    return query.first()


def update_contact_props(page, props):
    page.props = props
    flag_modified(page, "props")
    db.session.commit()
    return page
