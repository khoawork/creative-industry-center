from repositories.pages.record_repository import (
    get_header,
    update_header,
    get_governance,
    update_governance,
    get_cta_list,
    update_cta_list,
    get_role,
    add_role,
    update_role,
    delete_role,
    get_all_records,
    get_record_by_id,
    create_record,
    update_record,
    delete_record,
    get_honor_rolls,
    add_honor_roll,
    update_honor_roll,
    delete_honor_roll,
    get_process,
    update_process,
)
from utils.error import NotFoundError, ValidationError


# ---------- Header ----------
def get_page_header():
    header = get_header()
    if not header:
        raise NotFoundError("Không tìm thấy header của trang records.")
    return header


def patch_header(data: dict, partial: bool = True):
    if not data:
        raise ValidationError("Yêu cầu không có dữ liệu để cập nhật header.")
    return update_header(header_data=data)


# ---------- Governance ----------
def get_governance_section():
    gov = get_governance()
    if not gov:
        raise NotFoundError("Không tìm thấy phần governance.")
    return gov


def patch_governance(data: dict, partial: bool = True):
    if not data:
        raise ValidationError("Yêu cầu không có dữ liệu để cập nhật governance.")
    return update_governance(governance_data=data)


# ---------- Governance CTA ----------
def get_cta_list_service():
    return get_cta_list()


def put_cta_list(cta_list: list):
    if not isinstance(cta_list, list):
        raise ValidationError("CTA list phải là mảng.")
    return update_cta_list(cta_list=cta_list)


# ---------- CTA Roles CRUD ----------
def get_role_service(cta_id: int, role_id: int):
    role = get_role(cta_id, role_id)
    if not role:
        raise NotFoundError("Không tìm thấy role.")
    return role


def create_role_service(cta_id: int, role_data: dict):
    return add_role(cta_id, role_data)


def update_role_service(cta_id: int, role_id: int, role_data: dict):
    return update_role(cta_id, role_id, role_data)


def delete_role_service(cta_id: int, role_id: int):
    return delete_role(cta_id, role_id)


# ---------- Record (SQL) ----------
def get_records():
    return get_all_records()


def get_record(record_id: str):
    rec = get_record_by_id(record_id)
    if not rec:
        raise NotFoundError("Không tìm thấy record.")
    return rec


def create_record_service(dto):
    return create_record(dto)


def update_record_service(record_id: str, dto, partial: bool = True):
    rec = get_record_by_id(record_id)
    if not rec:
        raise NotFoundError("Record không tồn tại.")
    return update_record(record_id, dto)


def delete_record_service(record_id: str):
    rec = get_record_by_id(record_id)
    if not rec:
        raise NotFoundError("Record không tồn tại.")
    return delete_record(record_id)


# ---------- Honor Roll (JSON) ----------
def get_honor_rolls_service():
    return get_honor_rolls()


def create_honor_roll_service(data: dict):
    return add_honor_roll(data)


def update_honor_roll_service(honor_id: int, data: dict):
    return update_honor_roll(honor_id=honor_id, honor_data=data)


def delete_honor_roll_service(honor_id: int):
    return delete_honor_roll(honor_id=honor_id)


# ---------- Process ----------
def get_process_service():
    proc = get_process()
    if not proc:
        raise NotFoundError("Không tìm thấy phần process.")
    return proc


def patch_process_service(data: dict, partial: bool = True):
    if not data:
        raise ValidationError("Yêu cầu không có dữ liệu để cập nhật process.")
    return update_process(process_data=data)
