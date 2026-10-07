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
        target_name = (sheet_name or "DangKySuKien").strip()

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
                f.get("label") or f.get("key") for f in fields_config if f.get("key")
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


def test_sheet_connection(sheet_url_or_id: str, sheet_name: str = "Trang tính1", fields_config: list = None):
    """
    Kiểm tra kết nối và đồng bộ tiêu đề cột (không ghi dữ liệu test).
    """
    return sync_fields_to_worksheet(sheet_url_or_id, sheet_name, fields_config)


def append_row_to_google_sheet(
    sheet_url_or_id: str, sheet_name: str, payload: dict, fields_config: list = None
):
    """
    Ghi một dòng dữ liệu mới vào Google Sheet bằng Google Sheets API (gspread).
    """
    spreadsheet_id = extract_spreadsheet_id(sheet_url_or_id)
    if not spreadsheet_id:
        raise ValueError("Đường dẫn Google Sheet không hợp lệ!")

    client, bot_email = get_gspread_client()
    spreadsheet = client.open_by_key(spreadsheet_id)

    # 1. Mở Worksheet: ưu tiên sheet_name, nếu không tìm thấy thì mở tab đầu tiên
    worksheet = None
    target_sheet_name = (sheet_name or "").strip()
    if target_sheet_name:
        try:
            worksheet = spreadsheet.worksheet(target_sheet_name)
        except Exception:
            pass
    if not worksheet:
        worksheet = spreadsheet.sheet1

    # 2. Xác định danh sách keys và labels tiêu đề
    if fields_config and len(fields_config) > 0:
        field_keys = ["submittedAt"] + [
            f.get("key") for f in fields_config if f.get("key")
        ]
        header_labels = ["Thời gian gửi"] + [
            f.get("label") or f.get("key") for f in fields_config if f.get("key")
        ]
    else:
        field_keys = ["submittedAt"] + [k for k in payload.keys() if k != "submittedAt"]
        header_labels = ["Thời gian gửi"] + [
            k for k in payload.keys() if k != "submittedAt"
        ]

    # 3. Kiểm tra nếu sheet còn trống thì chèn hàng tiêu đề vào A1
    existing_records = worksheet.get_all_values()
    if not existing_records or len(existing_records) == 0:
        worksheet.update(values=[header_labels], range_name="A1")
        try:
            # Format header in đậm
            worksheet.format(
                "1:1",
                {
                    "textFormat": {
                        "bold": True,
                        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0},
                    },
                    "backgroundColor": {
                        "red": 0.286,
                        "green": 0.0,
                        "blue": 0.012,
                    },  # #490003
                },
            )
            worksheet.freeze(rows=1)
        except Exception as fmt_err:
            logger.warning(f"Không thể định dạng header: {fmt_err}")

    # 4. Ghép dòng dữ liệu theo thứ tự cột
    submitted_time = payload.get("submittedAt") or datetime.now().strftime(
        "%d/%m/%Y %H:%M:%S"
    )
    row_values = []
    for key in field_keys:
        if key == "submittedAt":
            row_values.append(submitted_time)
        else:
            val = payload.get(key, "")
            if isinstance(val, bool):
                val = "Có" if val else "Không"
            elif isinstance(val, (list, dict)):
                val = json.dumps(val, ensure_ascii=False)
            row_values.append(str(val) if val is not None else "")

    # 5. Thêm dòng vào Google Sheet
    worksheet.append_row(row_values)

    return {
        "success": True,
        "spreadsheet_title": spreadsheet.title,
        "worksheet_title": worksheet.title,
        "rowCount": worksheet.row_count,
    }
