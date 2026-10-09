import os
import json
import logging
from flask import Blueprint, request, jsonify
from extensions import db
from models.FormSubmissionModel import FormSubmission
from services.google_sheets_service import (
    get_service_account_credentials_info,
    test_sheet_connection,
    sync_fields_to_worksheet,
    sync_all_worksheets,
    append_row_to_google_sheet,
    extract_spreadsheet_id,
    BACKEND_DIR,
)

logger = logging.getLogger(__name__)

form_api = Blueprint("form_api", __name__, url_prefix="/forms")

CONFIGS_FILE = os.path.join(BACKEND_DIR, "form_configs.json")


def load_backend_form_configs():
    if os.path.isfile(CONFIGS_FILE):
        try:
            with open(CONFIGS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Lỗi đọc form_configs.json: {e}")
    return {}


def save_backend_form_config(form_id, config_data):
    configs = load_backend_form_configs()
    existing = configs.get(form_id) or {}

    # Merge an toàn: không làm mất sheetUrl, sheetName, lastSyncedAt của form
    merged = {**existing, **config_data}
    if not config_data.get("sheetUrl") and existing.get("sheetUrl"):
        merged["sheetUrl"] = existing["sheetUrl"]
    if not config_data.get("sheetName") and existing.get("sheetName"):
        merged["sheetName"] = existing["sheetName"]
    if existing.get("lastSyncedAt") and not config_data.get("lastSyncedAt"):
        merged["lastSyncedAt"] = existing["lastSyncedAt"]

    # Đảm bảo trường cố định của hệ thống không bị mất
    if form_id == "training_registration":
        fields = list(merged.get("fields") or [])
        keys = [f.get("key") for f in fields]
        system_fields = []
        if "courseCode" not in keys:
            system_fields.append({
                "key": "courseCode",
                "label": "Mã khóa học",
                "type": "text",
                "placeholder": "Mã khóa học",
                "required": True,
                "readOnly": True,
                "colSpan": 1,
            })
        if "courseName" not in keys:
            system_fields.append({
                "key": "courseName",
                "label": "Tên khóa học",
                "type": "text",
                "placeholder": "Tên khóa học đăng ký",
                "required": True,
                "readOnly": True,
                "colSpan": 1,
            })
        if system_fields:
            merged["fields"] = system_fields + fields

    configs[form_id] = merged
    try:
        with open(CONFIGS_FILE, "w", encoding="utf-8") as f:
            json.dump(configs, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"Lỗi ghi form_configs.json: {e}")
    return merged


@form_api.route("/service-account", methods=["GET"])
def get_service_account_info():
    """
    Lấy thông tin tài khoản dịch vụ Google Service Account (email bot để share quyền trên Google Sheet).
    """
    try:
        info = get_service_account_credentials_info()
        return jsonify({
            "success": True,
            "configured": info["configured"],
            "botEmail": info["email"],
            "type": info["type"],
            "keyFilePath": info["path"],
            "message": "Đã cấu hình Google Service Account thành công!" if info["configured"] else "Chưa tìm thấy file service_account.json trong thư mục backend. Hãy đặt file key vào thư mục backend/service_account.json.",
        }), 200
    except Exception as e:
        logger.error(f"Lỗi khi lấy thông tin Service Account: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@form_api.route("/configs", methods=["GET"])
def get_all_form_configs():
    """
    Lấy toàn bộ cấu hình biểu mẫu từ file form_configs.json trong backend.
    """
    configs = load_backend_form_configs()
    return jsonify({"success": True, "data": configs}), 200


@form_api.route("/config/<form_id>", methods=["GET", "POST"])
def form_config_endpoint(form_id):
    """
    Lấy hoặc lưu cấu hình form vào backend và tự động tạo tab + tiêu đề cột trên Google Sheet.
    """
    if request.method == "POST":
        config_data = request.get_json(silent=True) or {}
        saved_config = save_backend_form_config(form_id, config_data)

        # Tự động đồng bộ các cột fields lên đúng tab trang tính trên Google Sheet (KHÔNG ghi dữ liệu test)
        sheet_url = saved_config.get("sheetUrl")
        sheet_name = saved_config.get("sheetName") or "DangKySuKien"
        fields = saved_config.get("fields") or []
        sync_result = None
        if sheet_url:
            try:
                sync_result = sync_fields_to_worksheet(sheet_url, sheet_name, fields)
            except Exception as sync_err:
                logger.warning(f"Lỗi tự động sync fields lên sheet: {sync_err}")

        return jsonify({
            "success": True,
            "message": "Đã lưu cấu hình và đồng bộ các cột vào Google Sheet!",
            "syncResult": sync_result,
            "data": saved_config,
        }), 200

    configs = load_backend_form_configs()
    return jsonify({"success": True, "data": configs.get(form_id)}), 200


@form_api.route("/sync-fields", methods=["POST"])
def sync_fields():
    """
    Khởi tạo hoặc cập nhật các cột fields vào đúng tab trang tính trong Google Sheet (chỉ Hàng 1 tiêu đề, không có dữ liệu test).
    """
    payload = request.get_json(silent=True) or {}
    sheet_url = payload.get("sheetUrl", "")
    sheet_name = payload.get("sheetName", "DangKySuKien")
    fields_config = payload.get("fields") or []

    if not sheet_url:
        return jsonify({"success": False, "message": "Vui lòng nhập đường dẫn Google Sheet!"}), 400

    result = sync_fields_to_worksheet(sheet_url, sheet_name, fields_config)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code


@form_api.route("/sync-all", methods=["POST"])
def sync_all_forms():
    """
    Đồng bộ 1 lần duy nhất cho tất cả các Form:
    Tự động tạo hoặc kiểm tra cấu trúc từng worksheet cho toàn bộ các form trong Google Sheet.
    Lưu lại dấu mốc lastSyncedAt vào backend để lần sau không cần đồng bộ lại.
    """
    from datetime import datetime, timezone
    payload = request.get_json(silent=True) or {}
    sheet_url = payload.get("sheetUrl") or ""
    forms_payload = payload.get("forms") or []

    backend_configs = load_backend_form_configs()

    if not sheet_url:
        for form_id, cfg in backend_configs.items():
            if cfg.get("sheetUrl"):
                sheet_url = cfg["sheetUrl"]
                break

    if not sheet_url:
        return jsonify({"success": False, "message": "Vui lòng cung cấp URL Google Sheet để đồng bộ!"}), 400

    results = []
    now_iso = datetime.now(timezone.utc).isoformat()

    # Nếu frontend gửi danh sách forms
    forms_to_sync = forms_payload if forms_payload else [{"id": k, **v} for k, v in backend_configs.items()]

    sync_response = sync_all_worksheets(sheet_url, forms_to_sync)

    if sync_response.get("success"):
        for res_item in sync_response.get("results", []):
            if res_item.get("success"):
                fid = res_item.get("formId")
                if fid in backend_configs:
                    backend_configs[fid]["lastSyncedAt"] = now_iso
                    backend_configs[fid]["sheetUrl"] = sheet_url
                    backend_configs[fid]["syncedSheetName"] = res_item.get("sheetName")

        # Lưu lại trạng thái lastSyncedAt vào file JSON
        try:
            with open(CONFIGS_FILE, "w", encoding="utf-8") as f:
                json.dump(backend_configs, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Lỗi lưu lastSyncedAt vào form_configs.json: {e}")

    sync_response["syncedAt"] = now_iso
    status_code = 200 if sync_response.get("success") else 400
    return jsonify(sync_response), status_code


@form_api.route("/test-connection", methods=["POST"])
def test_connection():
    """
    Kiểm tra kết nối và TỰ ĐỘNG KHỞI TẠO TIÊU ĐỀ + 1 DÒNG DỮ LIỆU MẪU VÀO GOOGLE SHEET.
    """
    payload = request.get_json(silent=True) or {}
    sheet_url = payload.get("sheetUrl", "")
    sheet_name = payload.get("sheetName", "Trang tính1")
    fields_config = payload.get("fields") or []

    if not sheet_url:
        return jsonify({"success": False, "message": "Vui lòng nhập đường dẫn Google Sheet!"}), 400

    result = test_sheet_connection(sheet_url, sheet_name, fields_config)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code


@form_api.route("/submit", methods=["POST"])
def submit_form():
    """
    Tiếp nhận dữ liệu biểu mẫu từ Frontend người dùng.
    1. Lưu bản ghi vào bảng form_submission trong cơ sở dữ liệu (đảm bảo không mất dữ liệu).
    2. Tự động lấy sheetUrl đã lưu nếu frontend không gửi kèm.
    3. Đẩy dữ liệu vào Google Sheet qua Service Account.
    """
    payload = request.get_json(silent=True) or {}
    form_id = payload.get("formId") or "event_newsletter"
    data = payload.get("data") or {}
    sheet_url = payload.get("sheetUrl") or ""
    sheet_name = payload.get("sheetName") or ""
    fields_config = payload.get("fields") or []

    # Nếu frontend không truyền sheetUrl, tự động lấy từ cấu hình đã lưu của form
    if not sheet_url:
        backend_configs = load_backend_form_configs()
        form_cfg = backend_configs.get(form_id) or {}
        sheet_url = form_cfg.get("sheetUrl") or ""
        sheet_name = sheet_name or form_cfg.get("sheetName") or "Trang tính1"
        if not fields_config:
            fields_config = form_cfg.get("fields") or []

    if not sheet_name:
        sheet_name = "Trang tính1"

    if not data or not isinstance(data, dict):
        return jsonify({"success": False, "message": "Dữ liệu biểu mẫu không hợp lệ!"}), 400

    # 1. Lưu dự phòng vào Database
    sheet_id = extract_spreadsheet_id(sheet_url) if sheet_url else None
    submission = FormSubmission(
        form_id=form_id,
        data=data,
        synced_to_sheet=False,
        sheet_id=sheet_id,
    )
    db.session.add(submission)
    db.session.commit()

    # 2. Đẩy vào Google Sheet nếu có sheetUrl
    sync_success = False
    sync_error_msg = None
    if sheet_url:
        try:
            append_res = append_row_to_google_sheet(
                sheet_url_or_id=sheet_url,
                sheet_name=sheet_name,
                payload=data,
                fields_config=fields_config,
            )
            sync_success = True
            submission.synced_to_sheet = True
            db.session.commit()
            logger.info(f"Đã đồng bộ biểu mẫu {form_id} lên Google Sheet: {append_res}")
        except Exception as e:
            sync_error_msg = str(e)
            submission.sync_error = sync_error_msg
            db.session.commit()
            logger.warning(f"Lỗi khi đẩy vào Google Sheet (đã lưu DB an toàn): {sync_error_msg}")

    return jsonify({
        "success": True,
        "submissionId": submission.id,
        "syncedToSheet": sync_success,
        "syncError": sync_error_msg,
        "message": "Gửi thông tin thành công!",
    }), 200


@form_api.route("/submissions/<form_id>", methods=["GET"])
def get_submissions(form_id):
    """
    Xem danh sách dữ liệu người dùng đã gửi theo từng biểu mẫu (cho Admin kiểm tra).
    """
    try:
        submissions = FormSubmission.query.filter_by(form_id=form_id).order_by(FormSubmission.id.desc()).limit(100).all()
        return jsonify({
            "success": True,
            "data": [s.to_dict() for s in submissions],
            "total": len(submissions),
        }), 200
    except Exception as e:
        logger.error(f"Lỗi khi lấy danh sách submissions: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
