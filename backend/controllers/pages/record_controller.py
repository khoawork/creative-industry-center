from flask import Blueprint, request
from marshmallow import ValidationError as MarshmallowValidationError
from utils.error import NotFoundError
from dto.record_dto import (
    RecordHeaderDto,
    RecordHeaderResponseDto,
    RecordHolderGovernanceDto,
    RecordHolderGovernanceResponseDto,
    RecordHolderGovernanceCtaDto,
    RecordHolderGovernanceCtaResponseDto,
    RecordHolderGovernanceCtaRoleDto,
    RecordHolderGovernanceCtaResponseDto,
    RecordResquestDto,
    RecordResponseDto,
    RecordHonorRollDto,
    RecordHonorRollResponseDto,
    RecordSectionProcessDto,
    RecordSectionProcessResponseDto,
)
from services import record_service as record_svc
from utils.json import success_response, error_response

# Blueprint for records page API
record_page_api = Blueprint("record_page_api", __name__, url_prefix="/records")


# ------------------------------------------------------------
# Error handling for marshmallow validation errors
# ------------------------------------------------------------
@record_page_api.errorhandler(MarshmallowValidationError)
def handle_validation_error(error):
    return error_response(
        message="Dữ liệu đầu vào không hợp lệ.",
        status_code=422,
        error_code="VALIDATION_ERROR",
        details=error.messages,
    )


# ------------------------------------------------------------
# Header (GET & PATCH/PUT)
# ------------------------------------------------------------
@record_page_api.get("/header")
def get_header():
    try:
        data = record_svc.get_page_header()
        result = RecordHeaderResponseDto().dump(data)
        return success_response(data=result)
    except NotFoundError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


@record_page_api.patch("/header")
@record_page_api.put("/header")
def update_header():
    payload = RecordHeaderDto().load(request.get_json() or {}, partial=True)
    updated = record_svc.patch_header(vars(payload))
    result = RecordHeaderResponseDto().dump(updated)
    return success_response(data=result, message="Cập nhật header thành công.")


# ------------------------------------------------------------
# Governance (GET & PATCH/PUT)
# ------------------------------------------------------------
@record_page_api.get("/governance")
def get_governance():
    try:
        data = record_svc.get_governance_section()
        result = RecordHolderGovernanceResponseDto().dump(data)
        return success_response(data=result)
    except NotFoundError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


@record_page_api.patch("/governance")
@record_page_api.put("/governance")
def update_governance():
    try:
        payload = RecordHolderGovernanceDto().load(
            request.get_json() or {}, partial=True
        )
        updated = record_svc.patch_governance(vars(payload))
        result = RecordHolderGovernanceResponseDto().dump(updated)
        return success_response(data=result, message="Cập nhật governance thành công.")
    except NotFoundError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


# ------------------------------------------------------------
# Governance CTA list (GET & PUT)
# ------------------------------------------------------------
@record_page_api.get("/governance/cta")
def get_cta_list():
    try:
        data = record_svc.get_cta_list_service()
        result = RecordHolderGovernanceCtaResponseDto(many=True).dump(data)
        return success_response(data=result)
    except NotFoundError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


@record_page_api.put("/governance/cta")
def replace_cta_list():
    cta_list = request.get_json() or []
    # Validate each CTA item
    schema = RecordHolderGovernanceCtaDto(many=True)
    validated = schema.load(cta_list)
    updated = record_svc.put_cta_list(validated)
    result = RecordHolderGovernanceCtaResponseDto(many=True).dump(updated)
    return success_response(data=result, message="Cập nhật CTA list thành công.")


# ------------------------------------------------------------
# CTA Role CRUD (under a specific CTA)
# ------------------------------------------------------------
@record_page_api.get("/governance/cta/<int:cta_id>/roles")
def get_roles(cta_id):
    # roles are stored inside the CTA object; fetch CTA then return its roles
    cta = record_svc.get_cta_list_service()
    for item in cta:
        if item["id"] == cta_id:
            roles = item.get("roles", [])
            result = RecordHolderGovernanceCtaRoleResponseDto(many=True).dump(roles)
            return success_response(data=result)
    return error_response(f"CTA id {cta_id} không tồn tại.", 404)


@record_page_api.post("/governance/cta/<int:cta_id>/roles")
def create_role(cta_id):
    role_data = RecordHolderGovernanceCtaRoleDto().load(request.get_json() or {})
    created = record_svc.create_role_service(cta_id, vars(role_data))
    result = RecordHolderGovernanceCtaRoleResponseDto().dump(created)
    return success_response(
        data=result, message="Tạo role thành công.", status_code=201
    )


@record_page_api.get("/governance/cta/<int:cta_id>/roles/<int:role_id>")
def get_role(cta_id, role_id):
    role = record_svc.get_role_service(cta_id, role_id)
    result = RecordHolderGovernanceCtaRoleResponseDto().dump(role)
    return success_response(data=result)


@record_page_api.patch("/governance/cta/<int:cta_id>/roles/<int:role_id>")
@record_page_api.put("/governance/cta/<int:cta_id>/roles/<int:role_id>")
def update_role(cta_id, role_id):
    role_data = RecordHolderGovernanceCtaRoleDto().load(
        request.get_json() or {}, partial=True
    )
    updated = record_svc.update_role_service(cta_id, role_id, vars(role_data))
    result = RecordHolderGovernanceCtaRoleResponseDto().dump(updated)
    return success_response(data=result, message="Cập nhật role thành công.")


@record_page_api.delete("/governance/cta/<int:cta_id>/roles/<int:role_id>")
def delete_role(cta_id, role_id):
    record_svc.delete_role_service(cta_id, role_id)
    return "", 204


# ------------------------------------------------------------
# Record CRUD (SQL model)
# ------------------------------------------------------------
@record_page_api.get("/items")
def list_records():
    items = record_svc.get_records()
    result = RecordResponseDto(many=True).dump(items)
    return success_response(data=result)


@record_page_api.post("/items")
def create_record():
    payload = RecordResquestDto().load(request.get_json() or {})
    created = record_svc.create_record_service(vars(payload))
    result = RecordResponseDto().dump(created)
    return success_response(
        data=result, message="Tạo record thành công.", status_code=201
    )


@record_page_api.get("/items/<int:record_id>")
def get_record(record_id):
    rec = record_svc.get_record(str(record_id))
    result = RecordResponseDto().dump(rec)
    return success_response(data=result)


@record_page_api.patch("/items/<int:record_id>")
@record_page_api.put("/items/<int:record_id>")
def update_record(record_id):
    payload = RecordResquestDto().load(request.get_json() or {}, partial=True)
    updated = record_svc.update_record_service(str(record_id), vars(payload))
    result = RecordResponseDto().dump(updated)
    return success_response(data=result, message="Cập nhật record thành công.")


@record_page_api.delete("/items/<int:record_id>")
def delete_record(record_id):
    record_svc.delete_record_service(str(record_id))
    return "", 204


# ------------------------------------------------------------
# Honor Roll CRUD (JSON stored in page.props)
# ------------------------------------------------------------
@record_page_api.get("/honor-rolls")
def list_honor_rolls():
    items = record_svc.get_honor_rolls_service()
    result = RecordHonorRollResponseDto(many=True).dump(items)
    return success_response(data=result)


@record_page_api.post("/honor-rolls")
def create_honor_roll():
    payload = RecordHonorRollDto().load(request.get_json() or {})
    created = record_svc.create_honor_roll_service(vars(payload))
    result = RecordHonorRollResponseDto().dump(created)
    return success_response(
        data=result, message="Tạo honor roll thành công.", status_code=201
    )


@record_page_api.get("/honor-rolls/<int:honor_id>")
def get_honor_roll(honor_id):
    # Service does not have a get_one, reuse list and filter
    items = record_svc.get_honor_rolls_service()
    for item in items:
        if item["id"] == honor_id:
            result = RecordHonorRollResponseDto().dump(item)
            return success_response(data=result)
    return error_response(f"Honor roll id {honor_id} không tồn tại.", 404)


@record_page_api.patch("/honor-rolls/<int:honor_id>")
@record_page_api.put("/honor-rolls/<int:honor_id>")
def update_honor_roll(honor_id):
    payload = RecordHonorRollDto().load(request.get_json() or {}, partial=True)
    updated = record_svc.update_honor_roll_service(honor_id, vars(payload))
    result = RecordHonorRollResponseDto().dump(updated)
    return success_response(data=result, message="Cập nhật honor roll thành công.")


@record_page_api.delete("/honor-rolls/<int:honor_id>")
def delete_honor_roll(honor_id):
    record_svc.delete_honor_roll_service(honor_id)
    return "", 204


# ------------------------------------------------------------
# Process section (GET & PATCH)
# ------------------------------------------------------------
@record_page_api.get("/process")
def get_process():
    proc = record_svc.get_process_service()
    result = RecordSectionProcessResponseDto().dump(proc)
    return success_response(data=result)


@record_page_api.patch("/process")
@record_page_api.put("/process")
def update_process():
    payload = RecordSectionProcessDto().load(request.get_json() or {}, partial=True)
    updated = record_svc.patch_process_service(vars(payload))
    result = RecordSectionProcessResponseDto().dump(updated)
    return success_response(data=result, message="Cập nhật process thành công.")
