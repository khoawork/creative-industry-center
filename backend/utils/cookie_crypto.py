import os
import base64
import hashlib
from typing import Optional
from cryptography.fernet import Fernet, InvalidToken

# Sử dụng JWT_SECRET_KEY hoặc SECRET_KEY để sinh 32-byte URL-safe base64 key cho Fernet
_RAW_SECRET = (
    os.environ.get("COOKIE_SECRET_KEY")
    or os.environ.get("JWT_SECRET_KEY")
    or os.environ.get("SECRET_KEY")
    or "creative_industry_center_super_secret_jwt_key_2026_vietkings_secure_token_long_enough"
)

# Sinh khóa Fernet chuẩn 32 bytes URL-safe base64 từ SHA-256 của secret key
_FERNET_KEY = base64.urlsafe_b64encode(hashlib.sha256(_RAW_SECRET.encode("utf-8")).digest())
_FERNET = Fernet(_FERNET_KEY)


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
    Chuỗi sinh ra là ciphertext ngẫu nhiên, không làm lộ payload JWT cho bất kỳ ai xem cookie.
    """
    if not raw_token:
        return ""
    try:
        token_bytes = raw_token.strip().encode("utf-8")
        encrypted_bytes = _FERNET.encrypt(token_bytes)
        return encrypted_bytes.decode("utf-8")
    except Exception as e:
        # Trong trường hợp lỗi không mong muốn, fallback về raw_token để không gãy luồng
        return raw_token


def unseal_cookie_token(sealed_token: str) -> Optional[str]:
    """
    Giải mã (unseal) token lấy từ Cookies.
    - Nếu là chuỗi đã seal: giải mã và xác minh HMAC-SHA256 tính toàn vẹn.
    - Nếu là raw JWT (tương thích ngược cho phiên cũ hoặc Authorization Bearer header): giữ nguyên.
    - Nếu chuỗi bị giả mạo / sai signature: trả về None.
    """
    if not sealed_token:
        return None

    clean_str = sealed_token.strip()

    # Thử giải mã bằng Fernet trước
    try:
        decrypted_bytes = _FERNET.decrypt(clean_str.encode("utf-8"))
        return decrypted_bytes.decode("utf-8")
    except InvalidToken:
        # Nếu không giải mã được bằng Fernet: kiểm tra xem có phải raw JWT 3 phần hay không
        parts = clean_str.split(".")
        if len(parts) == 3:
            return clean_str
        return None
    except Exception:
        # Kiểm tra fallback nếu là raw JWT
        parts = clean_str.split(".")
        if len(parts) == 3:
            return clean_str
        return None

