import os
import datetime
import jwt
from typing import Optional, Dict, Any

# Khóa bí mật riêng biệt cho JWT đạt chuẩn 256-bit
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "creative_industry_center_super_secret_jwt_key_2026_vietkings_secure_token_long_enough"
JWT_ALGORITHM = "HS256"
# Thời hạn mặc định của token: 7 ngày
DEFAULT_EXPIRATION_SECONDS = 7 * 24 * 60 * 60


def generate_token(user, expires_in: int = DEFAULT_EXPIRATION_SECONDS) -> str:
    """Tạo JWT Token chứa thông tin nhận diện cơ bản của user"""
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(user.id),  # JWT RFC 7519: sub claim phải là String
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "iat": now,
        "exp": now + datetime.timedelta(seconds=expires_in),
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Giải mã và xác minh tính hợp lệ của token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token đã hết hạn
    except jwt.InvalidTokenError:
        return None  # Token không hợp lệ

