import os
from typing import Dict, Any, Optional
import requests
import jwt
from utils.error import AppError

KEYCLOAK_TOKEN_URL = os.getenv(
    "KEYCLOAK_TOKEN_URL",
    "http://localhost:8888/realms/sso-platform/protocol/openid-connect/token"
)
KEYCLOAK_USERINFO_URL = os.getenv(
    "KEYCLOAK_USERINFO_URL",
    "http://localhost:8888/realms/sso-platform/protocol/openid-connect/userinfo"
)
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "app-a")


def exchange_code_for_token_data(
    code: str,
    redirect_uri: str,
    code_verifier: Optional[str] = None
) -> Dict[str, Any]:
    """
    Gửi authorization code sang Keycloak để đổi lấy cặp Token (Access Token, ID Token, Refresh Token)
    """
    payload = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "code": code,
        "redirect_uri": redirect_uri,
    }
    if code_verifier:
        payload["code_verifier"] = code_verifier

    try:
        resp = requests.post(KEYCLOAK_TOKEN_URL, data=payload, timeout=10)
    except Exception as e:
        raise AppError(message=f"Không thể kết nối máy chủ SSO Hub: {str(e)}", status_code=502)

    if not resp.ok:
        err_msg = "Xác thực với SSO Hub thất bại."
        try:
            err_json = resp.json()
            err_msg = err_json.get("error_description") or err_json.get("error") or err_msg
        except Exception:
            pass
        raise AppError(message=err_msg, status_code=401, error_code="SSO_AUTH_FAILED")

    token_data = resp.json()
    return token_data


def extract_user_profile(token_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Trích xuất thông tin người dùng trực tiếp từ ID Token hoặc gọi UserInfo endpoint nếu cần
    """
    id_token = token_data.get("id_token")
    if id_token:
        try:
            # Giải mã claims từ ID Token (Keycloak đã đính kèm sub, email, name...)
            claims = jwt.decode(id_token, options={"verify_signature": False})
            if claims.get("sub"):
                return claims
        except Exception:
            pass

    # Fallback: Gọi UserInfo endpoint bằng Access Token
    access_token = token_data.get("access_token")
    if not access_token:
        raise AppError(message="SSO Hub không trả về Access Token", status_code=401)

    try:
        resp = requests.get(
            KEYCLOAK_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10
        )
        if resp.ok:
            return resp.json()
    except Exception as e:
        raise AppError(message=f"Lỗi lấy hồ sơ người dùng từ SSO Hub: {str(e)}", status_code=502)

    # Nếu cả 2 đều không được, decode access_token
    try:
        access_claims = jwt.decode(access_token, options={"verify_signature": False})
        if access_claims.get("sub"):
            return access_claims
    except Exception:
        pass

    raise AppError(message="Không thể trích xuất thông tin định danh từ SSO Hub", status_code=401)
