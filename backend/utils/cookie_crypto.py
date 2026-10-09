import os
import base64
import hashlib
import logging
from typing import Optional
from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger(__name__)

_cached_fernet = None


def _get_fernet() -> Fernet:
    global _cached_fernet
    if _cached_fernet is None:
        raw_secret = (
            os.environ.get("COOKIE_SECRET_KEY")
            or os.environ.get("JWT_SECRET_KEY")
            or os.environ.get("SECRET_KEY")
            or "creative_industry_center_super_secret_jwt_key_2026_vietkings_secure_token_long_enough"
        )
        fernet_key = base64.urlsafe_b64encode(hashlib.sha256(raw_secret.encode("utf-8")).digest())
        _cached_fernet = Fernet(fernet_key)
    return _cached_fernet


def hash_token(raw_token: str) -> str:
    """
    Băm token bằng thuật toán SHA-256 (dùng để lưu vết refresh token trong database).
    Đảm bảo an toàn: dù DB bị lộ cũng không thể tái tạo lại token gốc.
    """
    if not raw_token:
        return ""
    return hashlib.sha256(raw_token.strip().encode("utf-8")).hexdigest()


def seal_cookie_token(raw_token: str) -> str:
    """
    Mã hóa và băm ký (Authenticated Encryption) raw token trước khi set vào Cookies.
    Sử dụng AES-128-CBC kết hợp HMAC-SHA256 (chuẩn Fernet).
    Chuỗi sinh ra là ciphertext ngẫu nhiên an toàn, tuyệt đối không lộ payload JWT trong cookie.
    """
    if not raw_token:
        return ""
    try:
        fernet = _get_fernet()
        token_bytes = raw_token.strip().encode("utf-8")
        encrypted_bytes = fernet.encrypt(token_bytes)
        return encrypted_bytes.decode("utf-8")
    except Exception as e:
        logger.error(f"Lỗi mã hóa seal_cookie_token: {e}", exc_info=True)
        raise ValueError(f"Không thể mã hóa token vào cookie: {str(e)}")


def unseal_cookie_token(sealed_token: str) -> Optional[str]:
    """
    Giải mã (unseal) token lấy từ Cookies.
    Sử dụng Fernet decrypt để xác minh HMAC-SHA256 và giải mã về JWT gốc.
    - Nếu là chuỗi đã seal hợp lệ: giải mã và trả về raw JWT.
    - Nếu không phải chuỗi seal hợp lệ: trả về None (bác bỏ hoàn toàn, không chấp nhận raw JWT trong cookie).
    """
    if not sealed_token:
        return None

    clean_str = sealed_token.strip()

    try:
        fernet = _get_fernet()
        decrypted_bytes = fernet.decrypt(clean_str.encode("utf-8"))
        return decrypted_bytes.decode("utf-8")
    except InvalidToken:
        logger.warning("Cookie token không hợp lệ hoặc đã bị thay đổi (Invalid Fernet Token).")
        return None
    except Exception as e:
        logger.warning(f"Lỗi giải mã unseal_cookie_token: {e}")
        return None

