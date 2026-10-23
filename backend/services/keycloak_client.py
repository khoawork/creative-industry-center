import os
import logging
import urllib.parse
from typing import Dict, Any, Optional, List
import requests
import jwt
from utils.error import AppError

logger = logging.getLogger(__name__)

KEYCLOAK_TOKEN_URL = os.getenv(
    "KEYCLOAK_TOKEN_URL",
    "http://localhost:8888/realms/sso-platform/protocol/openid-connect/token"
)
KEYCLOAK_USERINFO_URL = os.getenv(
    "KEYCLOAK_USERINFO_URL",
    "http://localhost:8888/realms/sso-platform/protocol/openid-connect/userinfo"
)
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "app-a")

# Lưu lại host hoạt động gần nhất để tăng tốc các yêu cầu tiếp theo
_WORKING_HOST_OVERRIDE: Optional[str] = None


def _get_docker_gateway_ip() -> Optional[str]:
    """
    Tìm địa chỉ gateway của host khi backend chạy trong môi trường Linux Docker container
    """
    try:
        with open("/proc/net/route", "r") as f:
            for line in f.readlines()[1:]:
                parts = line.strip().split()
                if len(parts) >= 3 and parts[1] == "00000000":
                    import socket
                    import struct
                    return socket.inet_ntoa(struct.pack("<L", int(parts[2], 16)))
    except Exception:
        pass
    return None


def _get_candidate_urls(original_url: str) -> List[str]:
    """
    Sinh danh sách các URL ứng viên cho Keycloak endpoint nhằm tương thích giữa:
    - Host Windows / Localhost (localhost:8888, 127.0.0.1:8888)
    - Docker container trên Windows / Mac (host.docker.internal:8888)
    - Docker container trên Linux (host gateway IP: 172.17.0.1:8888)
    - Docker container cùng network (sso-keycloak:8080)
    """
    global _WORKING_HOST_OVERRIDE

    parsed = urllib.parse.urlparse(original_url)
    port = parsed.port
    port_str = f":{port}" if port else ":8888"

    candidate_netlocs: List[str] = []

    # 1. Host đã hoạt động thành công gần nhất
    if _WORKING_HOST_OVERRIDE and _WORKING_HOST_OVERRIDE not in candidate_netlocs:
        candidate_netlocs.append(_WORKING_HOST_OVERRIDE)

    # 2. Host gốc được chỉ định trong cấu hình
    if parsed.netloc and parsed.netloc not in candidate_netlocs:
        candidate_netlocs.append(parsed.netloc)

    # 3. Các địa chỉ fallback tiêu chuẩn
    fallback_candidates = [
        f"host.docker.internal{port_str}",
        f"127.0.0.1{port_str}",
        f"localhost{port_str}",
        "sso-keycloak:8080",
    ]

    gw_ip = _get_docker_gateway_ip()
    if gw_ip:
        fallback_candidates.append(f"{gw_ip}{port_str}")

    for candidate in fallback_candidates:
        if candidate not in candidate_netlocs:
            candidate_netlocs.append(candidate)

    urls: List[str] = []
    for netloc in candidate_netlocs:
        u = urllib.parse.urlunparse((
            parsed.scheme or "http",
            netloc,
            parsed.path,
            parsed.params,
            parsed.query,
            parsed.fragment
        ))
        if u not in urls:
            urls.append(u)

    return urls


def _send_request_with_host_fallback(method: str, url: str, **kwargs) -> requests.Response:
    """
    Gửi request với cơ chế tự động thử lần lượt các địa chỉ host khả dĩ.
    """
    global _WORKING_HOST_OVERRIDE

    candidate_urls = _get_candidate_urls(url)
    timeout = kwargs.pop("timeout", 5)
    errors = []

    for cand_url in candidate_urls:
        try:
            resp = requests.request(method, cand_url, timeout=timeout, **kwargs)
            # Nếu chạm được máy chủ Keycloak (kể cả HTTP 4xx trả về từ Keycloak)
            parsed = urllib.parse.urlparse(cand_url)
            _WORKING_HOST_OVERRIDE = parsed.netloc
            return resp
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            logger.warning("Kết nối SSO tới %s không thành công (%s), thử endpoint tiếp theo...", cand_url, type(e).__name__)
            errors.append(f"{cand_url} ({type(e).__name__})")
            continue
        except Exception as e:
            logger.warning("Lỗi bất ngờ khi gọi %s: %s", cand_url, str(e))
            errors.append(f"{cand_url} ({str(e)})")
            continue

    err_detail = "; ".join(errors) if errors else "Không có endpoint nào phản hồi"
    raise requests.exceptions.ConnectionError(
        f"Không thể kết nối máy chủ SSO Hub qua các địa chỉ: [{err_detail}]"
    )


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
        resp = _send_request_with_host_fallback("POST", KEYCLOAK_TOKEN_URL, data=payload)
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
        resp = _send_request_with_host_fallback(
            "GET",
            KEYCLOAK_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
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
