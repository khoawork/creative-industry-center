import os
import uuid
import datetime
import jwt
from typing import Optional, Dict, Any, Tuple

# Khóa bí mật riêng biệt cho JWT đạt chuẩn 256-bit
JWT_SECRET_KEY = (
    os.environ.get("JWT_SECRET_KEY")
    or "creative_industry_center_super_secret_jwt_key_2026_vietkings_secure_token_long_enough"
)
JWT_ALGORITHM = "HS256"

# Thời hạn Access Token: 30 phút (ngắn hạn để tăng cường bảo mật)
ACCESS_TOKEN_EXPIRATION_SECONDS = int(os.environ.get("ACCESS_TOKEN_EXPIRATION_SECONDS", 30 * 60))

# Thời hạn Refresh Token: 7 ngày
REFRESH_TOKEN_EXPIRATION_SECONDS = int(os.environ.get("REFRESH_TOKEN_EXPIRATION_SECONDS", 7 * 24 * 60 * 60))

# Tương thích ngược
DEFAULT_EXPIRATION_SECONDS = ACCESS_TOKEN_EXPIRATION_SECONDS


def generate_access_token(user, expires_in: int = ACCESS_TOKEN_EXPIRATION_SECONDS) -> str:
    """Tạo Access Token (JWT) ngắn hạn chứa định danh và quyền hạn của user"""
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "type": "access",
        "jti": uuid.uuid4().hex,
        "iat": now,
        "exp": now + datetime.timedelta(seconds=expires_in),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def generate_refresh_token(user, expires_in: int = REFRESH_TOKEN_EXPIRATION_SECONDS) -> str:
    """Tạo Refresh Token (JWT) dài hạn dùng để xin cấp lại Access Token mới"""
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(user.id),
        "type": "refresh",
        "jti": uuid.uuid4().hex,
        "iat": now,
        "exp": now + datetime.timedelta(seconds=expires_in),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def generate_token(user, expires_in: int = ACCESS_TOKEN_EXPIRATION_SECONDS) -> str:
    """Hàm sinh token tương thích ngược, mặc định sinh access token"""
    return generate_access_token(user, expires_in)


def verify_token(token: str, expected_type: Optional[str] = None) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Xác minh token và trả về tuple (payload, error_code).
    error_code có thể là: None, 'TOKEN_EXPIRED', 'INVALID_TOKEN', 'TOKEN_TYPE_MISMATCH'
    """
    if not token:
        return None, "TOKEN_MISSING"

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        # Nếu yêu cầu loại token cụ thể (access hoặc refresh)
        if expected_type:
            token_type = payload.get("type")
            if token_type and token_type != expected_type:
                return None, "TOKEN_TYPE_MISMATCH"
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "TOKEN_EXPIRED"
    except jwt.InvalidTokenError:
        return None, "INVALID_TOKEN"
    except Exception:
        return None, "INVALID_TOKEN"


def decode_token(token: str, expected_type: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Giải mã và xác minh tính hợp lệ của token (hàm tiện ích trả về None khi lỗi)"""
    payload, error = verify_token(token, expected_type=expected_type)
    return payload
