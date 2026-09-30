from flask import jsonify
from typing import Any, Optional, Dict

def success_response(
    data: Any = None,
    message: str = "Thành công",
    status_code: int = 200,
    meta: Optional[Dict[str, Any]] = None
):
    response_body = {
        "success": True,
        "message": message,
        "data": data
    }
    if meta is not None:
        response_body["meta"] = meta
        
    return jsonify(response_body), status_code


def error_response(
    message: str = "Có lỗi xảy ra",
    status_code: int = 400,
    error_code: Optional[str] = None,
    details: Any = None
):
    response_body = {
        "success": False,
        "message": message,
        "error": {
            "code": error_code or f"HTTP_{status_code}",
            "details": details
        }
    }
    return jsonify(response_body), status_code
