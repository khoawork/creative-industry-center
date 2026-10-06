from extensions import db
from models.PageModel import Page
from models.RecordModel import Record
from sqlalchemy.orm import joinedload


def get_page_props(slug):
    page = Page.query.filter_by(slug=slug).first()
    return page.props if page else None


def save_page_props(slug, props):
    page = Page.query.filter_by(slug=slug).first()
    if page:
        page.props = props
        db.session.add(page)
        db.session.commit()
    return page


# ---------- Header ----------
def get_header(slug="records"):
    props = get_page_props(slug)
    return props.get("header") if props else None


def update_header(slug, header_data):
    props = get_page_props(slug) or {}
    props["header"] = {**props.get("header", {}), **header_data}
    return save_page_props(slug, props)


# ---------- Governance ----------
def get_governance(slug="records"):
    props = get_page_props(slug)
    return props.get("governance") if props else None


def update_governance(slug, governance_data):
    props = get_page_props(slug) or {}
    props["governance"] = {**props.get("governance", {}), **governance_data}
    return save_page_props(slug, props)


# ---------- Governance CTA ----------
def get_cta_list(slug="records"):
    governance = get_governance(slug) or {}
    return governance.get("cta", [])


def update_cta_list(slug, cta_list):
    props = get_page_props(slug) or {}
    if "governance" not in props:
        props["governance"] = {}
    props["governance"]["cta"] = cta_list
    return save_page_props(slug, props)


# ---------- CTA Roles CRUD ----------
def get_role(cta_id, role_id, slug="records"):
    cta_list = get_cta_list(slug)
    for cta in cta_list:
        if cta.get("id") == cta_id:
            for role in cta.get("roles", []):
                if role.get("id") == role_id:
                    return role
    return None


def add_role(cta_id, role_data, slug="records"):
    cta_list = get_cta_list(slug)
    for cta in cta_list:
        if cta.get("id") == cta_id:
            roles = cta.setdefault("roles", [])
            roles.append(role_data)
            break
    return update_cta_list(slug, cta_list)


def update_role(cta_id, role_id, role_data, slug="records"):
    cta_list = get_cta_list(slug)
    for cta in cta_list:
        if cta.get("id") == cta_id:
            roles = cta.get("roles", [])
            for i, role in enumerate(roles):
                if role.get("id") == role_id:
                    roles[i] = {**role, **role_data}
                    break
            break
    return update_cta_list(slug, cta_list)


def delete_role(cta_id, role_id, slug="records"):
    cta_list = get_cta_list(slug)
    for cta in cta_list:
        if cta.get("id") == cta_id:
            roles = cta.get("roles", [])
            cta["roles"] = [r for r in roles if r.get("id") != role_id]
            break
    return update_cta_list(slug, cta_list)


# ---------- Record (SQL) CRUD ----------
def get_all_records():
    return Record.query.all()


def get_record_by_id(record_id):
    return Record.query.filter_by(id=record_id).first()


def create_record(data):
    record = Record(**data)
    db.session.add(record)
    db.session.commit()
    return record


def update_record(record_id, data):
    record = get_record_by_id(record_id)
    if not record:
        return None
    for key, value in data.items():
        setattr(record, key, value)
    db.session.commit()
    return record


def delete_record(record_id):
    record = get_record_by_id(record_id)
    if record:
        db.session.delete(record)
        db.session.commit()
    return record


# ---------- Honor Roll (JSON) CRUD ----------
def get_honor_rolls(slug="records"):
    props = get_page_props(slug) or {}
    return props.get("honor_rolls", [])


def set_honor_rolls(slug, honor_list):
    props = get_page_props(slug) or {}
    props["honor_rolls"] = honor_list
    return save_page_props(slug, props)


def add_honor_roll(slug, honor_data):
    honors = get_honor_rolls(slug)
    honors.append(honor_data)
    return set_honor_rolls(slug, honors)


def update_honor_roll(slug, honor_id, honor_data):
    honors = get_honor_rolls(slug)
    for i, h in enumerate(honors):
        if h.get("id") == honor_id:
            honors[i] = {**h, **honor_data}
            break
    return set_honor_rolls(slug, honors)


def delete_honor_roll(slug, honor_id):
    honors = get_honor_rolls(slug)
    honors = [h for h in honors if h.get("id") != honor_id]
    return set_honor_rolls(slug, honors)


# ---------- Process (JSON) ----------
def get_process(slug="records"):
    props = get_page_props(slug) or {}
    return props.get("process")


def update_process(slug, process_data):
    props = get_page_props(slug) or {}
    props["process"] = {**props.get("process", {}), **process_data}
    return save_page_props(slug, props)
