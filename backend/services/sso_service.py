from typing import Dict, Any, Optional
from repositories import user_repo
from services import keycloak_client
from models.UserModel import User, RoleEnum
from utils.error import BadRequestError, ForbiddenError
from utils.jwt_util import (
    generate_access_token,
    generate_refresh_token,
    ACCESS_TOKEN_EXPIRATION_SECONDS,
    REFRESH_TOKEN_EXPIRATION_SECONDS,
)
from utils.cookie_crypto import seal_cookie_token, hash_token


def handle_sso_login(
    code: str, redirect_uri: str, code_verifier: Optional[str] = None
) -> Dict[str, Any]:
    """
    Xử lý toàn bộ nghiệp vụ xác thực SSO:
    1. Đổi code lấy Tokens từ Keycloak
    2. Trích xuất hồ sơ người dùng (sub, email, name...)
    3. Đồng bộ / Tạo mới người dùng trong cơ sở dữ liệu (JIT Provisioning)
    4. Sinh và đóng gói Token/Cookie nội bộ
    """
    if not code:
        raise BadRequestError(message="Thiếu authorization code từ SSO Hub")

    # 1. Trao đổi lấy Token data từ Keycloak
    token_data = keycloak_client.exchange_code_for_token_data(
        code=code, redirect_uri=redirect_uri, code_verifier=code_verifier
    )

    # 2. Trích xuất thông tin người dùng an toàn
    kc_profile = keycloak_client.extract_user_profile(token_data)
    kc_sub = kc_profile.get("sub")
    if not kc_sub:
        raise BadRequestError(message="Hồ sơ SSO không chứa định danh duy nhất (sub)")

    kc_email = kc_profile.get("email") or f"{kc_sub}@sso.local"
    kc_username = kc_profile.get("preferred_username") or kc_email
    kc_name = kc_profile.get("name") or kc_username

    # 3. Đồng bộ vào Database
    user = user_repo.find_or_provision_sso_user(
        keycloak_id=kc_sub,
        email=kc_email,
        username=kc_username,
        full_name=kc_name,
        default_role=RoleEnum.ADMIN.value,
    )

    if not user.has_admin_access():
        raise ForbiddenError(
            message="Tài khoản không có quyền truy cập khu vực quản trị."
        )

    # 4. Sinh Token và Cookies nội bộ
    access_token = generate_access_token(
        user, expires_in=ACCESS_TOKEN_EXPIRATION_SECONDS
    )
    refresh_token = generate_refresh_token(
        user, expires_in=REFRESH_TOKEN_EXPIRATION_SECONDS
    )

    # Cập nhật session hash
    user_repo.update_login_session(user, hash_token(refresh_token))

    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "sealed_access_token": seal_cookie_token(access_token),
        "sealed_refresh_token": seal_cookie_token(refresh_token),
    }
