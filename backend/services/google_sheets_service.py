import os
import re
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Thư mục gốc backend
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CREDENTIALS_PATH = os.path.join(BACKEND_DIR, "service_account.json")

# Scope cần thiết cho Google Sheets & Drive API
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def extract_spreadsheet_id(url_or_id: str) -> str:
    """
    Trích xuất Spreadsheet ID từ URL Google Sheet hoặc trả về ID nếu đã là ID thuần.
    Ví dụ: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
    -> 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
    """
    if not url_or_id:
        return ""
    url_or_id = url_or_id.strip()
    match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", url_or_id)
    if match:
        return match.group(1)
    # Nếu không phải URL, có thể người dùng đã nhập trực tiếp ID
    if re.match(r"^[a-zA-Z0-9-_]{20,}$", url_or_id):
        return url_or_id
    return url_or_id


def get_service_account_credentials_info():
    """
    Kiểm tra và lấy thông tin Google Service Account.
    Ưu tiên 1: Biến môi trường GOOGLE_SERVICE_ACCOUNT_JSON (chuỗi JSON)
    Ưu tiên 2: Biến môi trường GOOGLE_SERVICE_ACCOUNT_FILE (đường dẫn file)
    Ưu tiên 3: File service_account.json trong thư mục backend/
    """
    env_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    if env_json:
        try:
            data = json.loads(env_json)
            return {
                "configured": True,
                "type": "env_json",
                "email": data.get("client_email", ""),
                "data": data,
                "path": None,
            }
        except Exception as e:
            logger.error(f"Lỗi phân tích cú pháp GOOGLE_SERVICE_ACCOUNT_JSON: {e}")

    file_path = (
        os.environ.get("GOOGLE_SERVICE_ACCOUNT_FILE") or DEFAULT_CREDENTIALS_PATH
    )
    if os.path.isfile(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {
                    "configured": True,
                    "type": "file",
                    "email": data.get("client_email", ""),
                    "data": data,
                    "path": file_path,
                }
        except Exception as e:
            logger.error(f"Lỗi đọc file service_account.json: {e}")

    # Chưa cấu hình, trả về email bot placeholder hướng dẫn
    return {
        "configured": False,
        "type": "none",
        "email": "cic-service-bot@cic-creative-center.iam.gserviceaccount.com",
        "data": None,
        "path": DEFAULT_CREDENTIALS_PATH,
    }


def get_gspread_client():
    """
    Khởi tạo và trả về client gspread đã được xác thực bằng Service Account.
    """
    try:
        import gspread
        from google.oauth2.service_account import Credentials
    except ImportError as e:
        raise RuntimeError(
            "Chưa cài đặt thư viện gspread hoặc google-auth. Vui lòng chạy: pip install gspread google-auth"
        ) from e

    info = get_service_account_credentials_info()
    if not info["configured"]:
        raise ValueError(
            f"Chưa tìm thấy file cấu hình Service Account. Vui lòng đặt file 'service_account.json' vào thư mục backend ({DEFAULT_CREDENTIALS_PATH}) hoặc cấu hình biến môi trường GOOGLE_SERVICE_ACCOUNT_JSON."
        )

    if info["data"]:
        credentials = Credentials.from_service_account_info(info["data"], scopes=SCOPES)
    elif info["path"]:
        credentials = Credentials.from_service_account_file(info["path"], scopes=SCOPES)
    else:
        raise ValueError("Không có thông tin xác thực Service Account hợp lệ.")

    client = gspread.authorize(credentials)
    return client, info["email"]


def sync_fields_to_worksheet(sheet_url_or_id: str, sheet_name: str, fields_config: list = None):
    """
    Admin cấu hình trường và đặt tên trang tính:
    - Nếu tab trang tính chưa tồn tại trong Google Sheet thì tự động tạo tab mới.
    - Cập nhật đúng Hàng 1 (Row 1) là tên các cột (Fields) do Admin thiết lập.
    - Định dạng in đậm chữ trắng nền đỏ rượu thương hiệu #490003 và cố định Hàng 1.
    - TUYỆT ĐỐI KHÔNG chèn bất kỳ dòng dữ liệu test nào (chỉ tạo khung cột chờ User gửi).
    """
    spreadsheet_id = extract_spreadsheet_id(sheet_url_or_id)
    if not spreadsheet_id:
        return {
            "success": False,
            "message": "Đường dẫn Google Sheet không hợp lệ hoặc không tìm thấy Sheet ID.",
        }

    try:
        client, bot_email = get_gspread_client()
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "need_service_account": True,
        }

    try:
        spreadsheet = client.open_by_key(spreadsheet_id)
        target_name = sanitize_worksheet_title(sheet_name or "DangKySuKien")

        # Tìm hoặc tự động tạo tab trang tính mới trong Sheet
        worksheet = None
        try:
            worksheet = spreadsheet.worksheet(target_name)
        except Exception:
            try:
                worksheet = spreadsheet.add_worksheet(title=target_name, rows=1000, cols=20)
            except Exception:
                worksheet = spreadsheet.sheet1

        # Xác định tiêu đề các cột từ danh sách fields cấu hình của Admin
        if fields_config and len(fields_config) > 0:
            header_labels = ["Thời gian gửi"] + [
                f.get("label") or f.get("key") or f.get("id")
                for f in fields_config
                if (f.get("key") or f.get("id"))
            ]
        else:
            header_labels = ["Thời gian gửi", "Họ và tên đại biểu", "Đơn vị / Doanh nghiệp", "Địa chỉ Email liên hệ", "Số điện thoại liên hệ", "Ghi chú / Yêu cầu thêm"]

        # Cập nhật HÀNG 1 của trang tính thành danh sách cột tiêu đề
        worksheet.update(values=[header_labels], range_name="A1")
        try:
            worksheet.format("1:1", {
                "textFormat": {"bold": True, "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}},
                "backgroundColor": {"red": 0.286, "green": 0.0, "blue": 0.012} # #490003
            })
            worksheet.freeze(rows=1)
        except Exception as fmt_err:
            logger.warning(f"Không thể định dạng header: {fmt_err}")

        return {
            "success": True,
            "title": spreadsheet.title,
            "worksheet_title": worksheet.title,
            "headers": header_labels,
            "botEmail": bot_email,
            "message": f"Đã khởi tạo thành công cấu trúc các cột cho trang tính '{worksheet.title}' trong Google Sheet '{spreadsheet.title}'!",
        }
    except Exception as e:
        err_msg = str(e)
        if (
            "403" in err_msg
            or "PERMISSION_DENIED" in err_msg
            or "The caller does not have permission" in err_msg
        ):
            return {
                "success": False,
                "botEmail": bot_email,
                "message": f"Google Sheet chưa cấp quyền cho Bot! Hãy mở Google Sheet, bấm nút 'Chia sẻ (Share)' và thêm email '{bot_email}' với quyền 'Người chỉnh sửa (Editor)'.",
            }
        elif "404" in err_msg or "SpreadsheetNotFound" in err_msg:
            return {
                "success": False,
                "botEmail": bot_email,
                "message": "Không tìm thấy Google Sheet. Vui lòng kiểm tra lại đường link đã dán.",
            }
        return {
            "success": False,
            "botEmail": bot_email,
            "message": f"Lỗi kết nối Google Sheet: {err_msg}",
        }


def sync_all_worksheets(sheet_url_or_id: str, forms_list: list):
    """
    Đồng bộ toàn bộ các trang tính cho tất cả forms cùng 1 lúc:
    - Mở spreadsheet 1 lần duy nhất để tối ưu hiệu năng và tránh quota limit.
    - Duyệt qua danh sách tab hiện có.
    - Cập nhật từng tab với danh sách cột tương ứng.
    """
    import time
    spreadsheet_id = extract_spreadsheet_id(sheet_url_or_id)
    if not spreadsheet_id:
        return {
            "success": False,
            "message": "Đường dẫn Google Sheet không hợp lệ hoặc không tìm thấy Sheet ID.",
            "results": [],
        }

    try:
        client, bot_email = get_gspread_client()
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "need_service_account": True,
            "results": [],
        }

    try:
        spreadsheet = client.open_by_key(spreadsheet_id)
    except Exception as e:
        err_msg = str(e)
        if "403" in err_msg or "PERMISSION_DENIED" in err_msg:
            return {
                "success": False,
                "botEmail": bot_email,
                "message": f"Google Sheet chưa cấp quyền cho Bot! Hãy mở Google Sheet, bấm nút 'Chia sẻ (Share)' và thêm email '{bot_email}' với quyền 'Người chỉnh sửa (Editor)'.",
                "results": [],
            }
        return {
            "success": False,
            "botEmail": bot_email,
            "message": f"Không thể mở Google Sheet: {err_msg}",
            "results": [],
        }

    # Lấy danh sách các worksheets hiện có
    try:
        existing_sheets = {ws.title: ws for ws in spreadsheet.worksheets()}
    except Exception as e:
        existing_sheets = {}

    results = []
    for item in forms_list:
        fid = item.get("id")
        target_name = sanitize_worksheet_title(item.get("sheetName") or "Trang tính1")
        fields_config = item.get("fields") or item.get("form_fields") or []

        try:
            # Tìm hoặc tạo worksheet
            if target_name in existing_sheets:
                worksheet = existing_sheets[target_name]
            else:
                worksheet = spreadsheet.add_worksheet(title=target_name, rows=1000, cols=25)
                existing_sheets[target_name] = worksheet

            # Xác định tiêu đề cột
            if fields_config and len(fields_config) > 0:
                header_labels = ["Thời gian gửi"] + [
                    f.get("label") or f.get("key") or f.get("id")
                    for f in fields_config
                    if (f.get("key") or f.get("id"))
                ]
            else:
                header_labels = ["Thời gian gửi", "Họ và tên", "Email", "Số điện thoại", "Ghi chú"]

            # Cập nhật hàng 1
            worksheet.update(values=[header_labels], range_name="A1")
            try:
                worksheet.format("1:1", {
                    "textFormat": {"bold": True, "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}},
                    "backgroundColor": {"red": 0.286, "green": 0.0, "blue": 0.012}
                })
                worksheet.freeze(rows=1)
            except Exception as fmt_err:
                logger.warning(f"Không thể định dạng header tab {target_name}: {fmt_err}")

            results.append({
                "formId": fid,
                "sheetName": target_name,
                "success": True,
                "message": f"Đã đồng bộ tab '{target_name}'",
            })
            time.sleep(0.3)
        except Exception as sheet_err:
            results.append({
                "formId": fid,
                "sheetName": target_name,
                "success": False,
                "message": str(sheet_err),
            })

    successful_count = sum(1 for r in results if r["success"])
    return {
        "success": successful_count > 0,
        "spreadsheetTitle": spreadsheet.title,
        "botEmail": bot_email,
        "total": len(forms_list),
        "successful": successful_count,
        "results": results,
        "message": f"Đã đồng bộ thành công {successful_count}/{len(forms_list)} trang tính vào Google Sheet '{spreadsheet.title}'!",
    }


def test_sheet_connection(sheet_url_or_id: str, sheet_name: str = "Trang tính1", fields_config: list = None):
    """
    Kiểm tra kết nối và đồng bộ tiêu đề cột (không ghi dữ liệu test).
    """
    return sync_fields_to_worksheet(sheet_url_or_id, sheet_name, fields_config)


def sanitize_worksheet_title(title: str) -> str:
    """
    Làm sạch tiêu đề trang tính theo quy chuẩn khắt khe của Google Sheets API:
    - Không chứa các ký tự cấm: * ? : / \\ [ ]
    - Không bắt đầu hoặc kết thúc bằng dấu nháy đơn '
    - Không dài quá 100 ký tự.
    """
    if not title:
        return "Trang tính1"
    cleaned = re.sub(r'[*?:/\\\[\]]', '_', str(title).strip())
    cleaned = cleaned.strip("'").strip()
    return cleaned[:100] if cleaned else "Trang tính1"


def append_row_to_google_sheet(
    sheet_url_or_id: str, sheet_name: str, payload: dict, fields_config: list = None
):
    """
    Ghi một dòng dữ liệu mới vào Google Sheet bằng Google Sheets API (gspread).
    - Tự động map chính xác giá trị vào đúng cột trên Sheet dựa theo Hàng 1 (Header row).
    - Tự động mở rộng thêm cột tiêu đề mới vào cuối Hàng 1 nếu phát hiện trường dữ liệu mới chưa có trên Sheet.
    - Chống lệch cột 100% kể cả khi thêm trường mới hoặc thay đổi thứ tự trường trong FormBuilder.
    """
    spreadsheet_id = extract_spreadsheet_id(sheet_url_or_id)
    if not spreadsheet_id:
        raise ValueError("Đường dẫn Google Sheet không hợp lệ!")

    client, bot_email = get_gspread_client()
    spreadsheet = client.open_by_key(spreadsheet_id)

    # 1. Mở Worksheet: ưu tiên sheet_name đã làm sạch
    worksheet = None
    target_sheet_name = sanitize_worksheet_title(sheet_name)
    if target_sheet_name:
        try:
            worksheet = spreadsheet.worksheet(target_sheet_name)
        except Exception:
            pass
    if not worksheet:
        worksheet = spreadsheet.sheet1

    # 2. Xây dựng từ điển đối chiếu Key <-> Label từ fields_config
    field_to_label = {}
    label_to_field = {}
    if fields_config and isinstance(fields_config, list):
        for f in fields_config:
            k = str(f.get("key") or f.get("id") or "").strip()
            lbl = str(f.get("label") or k).strip()
            if k:
                field_to_label[k] = lbl
                label_to_field[lbl.lower()] = k
                label_to_field[k.lower()] = k

    # 3. Lấy toàn bộ Hàng 1 (Header row) thực tế đang có trên Sheet
    existing_records = worksheet.get_all_values()
    sheet_headers = [h.strip() for h in existing_records[0]] if existing_records and len(existing_records) > 0 else []

    # Nếu Sheet chưa có tiêu đề hoặc rỗng hoàn toàn: tạo mới Hàng 1
    if not sheet_headers or all(h == "" for h in sheet_headers):
        if fields_config and len(fields_config) > 0:
            sheet_headers = ["Thời gian gửi"] + [
                str(f.get("label") or f.get("key") or f.get("id")).strip()
                for f in fields_config
                if (f.get("key") or f.get("id"))
            ]
        else:
            sheet_headers = ["Thời gian gửi"] + [
                k for k in payload.keys() if k != "submittedAt"
            ]
        worksheet.update(values=[sheet_headers], range_name="A1")
        try:
            worksheet.format("1:1", {
                "textFormat": {"bold": True, "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}},
                "backgroundColor": {"red": 0.286, "green": 0.0, "blue": 0.012},
            })
            worksheet.freeze(rows=1)
        except Exception as fmt_err:
            logger.warning(f"Không thể định dạng header mới: {fmt_err}")
    else:
        # Sheet ĐÃ CÓ Header: Kiểm tra xem có trường mới nào chưa có trong Hàng 1 không
        headers_lower = [h.lower() for h in sheet_headers]
        new_headers = []

        candidate_items = []
        if fields_config:
            for f in fields_config:
                k = str(f.get("key") or f.get("id") or "").strip()
                lbl = str(f.get("label") or k).strip()
                if k:
                    candidate_items.append((k, lbl))

        for k in payload.keys():
            if k != "submittedAt" and not any(c[0] == k for c in candidate_items):
                candidate_items.append((k, k))

        for k, lbl in candidate_items:
            if lbl.lower() not in headers_lower and k.lower() not in headers_lower:
                new_headers.append(lbl)
                headers_lower.append(lbl.lower())
                label_to_field[lbl.lower()] = k

        # Tự động bổ sung các cột mới vào cuối Hàng 1 nếu phát hiện trường mới
        if new_headers:
            sheet_headers.extend(new_headers)
            worksheet.update(values=[sheet_headers], range_name="A1")
            try:
                worksheet.format("1:1", {
                    "textFormat": {"bold": True, "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}},
                    "backgroundColor": {"red": 0.286, "green": 0.0, "blue": 0.012},
                })
            except Exception:
                pass

    # 4. Ghép dòng dữ liệu (row_values) chuẩn xác theo từng cột trong sheet_headers
    submitted_time = payload.get("submittedAt") or datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    row_values = []

    for col_header in sheet_headers:
        col_lower = col_header.lower()
        if col_lower in ["thời gian gửi", "thời gian", "submittedat", "timestamp", "ngày gửi"]:
            row_values.append(submitted_time)
            continue

        matched_val = None
        # Khớp theo key chính xác
        if col_header in payload:
            matched_val = payload[col_header]
        elif col_lower in payload:
            matched_val = payload[col_lower]
        # Khớp qua label_to_field
        elif col_lower in label_to_field:
            target_key = label_to_field[col_lower]
            matched_val = payload.get(target_key)
        else:
            # Khớp qua field_to_label
            for k, lbl in field_to_label.items():
                if lbl.lower() == col_lower and k in payload:
                    matched_val = payload[k]
                    break

        if matched_val is None:
            row_values.append("")
        else:
            if isinstance(matched_val, bool):
                val_str = "Có" if matched_val else "Không"
            elif isinstance(matched_val, (list, dict)):
                val_str = json.dumps(matched_val, ensure_ascii=False)
            else:
                val_str = str(matched_val)
            row_values.append(val_str)

    # 5. Thêm dòng an toàn vào Google Sheet
    worksheet.append_row(row_values)

    return {
        "success": True,
        "spreadsheet_title": spreadsheet.title,
        "worksheet_title": worksheet.title,
        "rowCount": worksheet.row_count,
        "matchedColumns": len(sheet_headers),
    }
