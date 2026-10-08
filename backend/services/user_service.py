from typing import List, Dict, Any, Optional
from repositories import user_repo
from dto.user_dto import UserCreateRequestDTO, UserUpdateRequestDTO, UserResponseDTO
from services import audit_service
from models.UserModel import User, RoleEnum
from utils.error import NotFoundError, ConflictError, ForbiddenError, BadRequestError


def get_all_users() -> List[Dict[str, Any]]:
    """Lấy danh sách tất cả tài khoản"""
    users = user_repo.get_all_users()
    schema = UserResponseDTO()
    return [schema.dump(u.to_dict()) for u in users]


def get_user_by_id(user_id: int) -> User:
    """Lấy thông tin tài khoản theo ID"""
    user = user_repo.get_user_by_id(user_id)
    if not user:
        raise NotFoundError(message=f"Không tìm thấy tài khoản ID {user_id}")
    return user


def create_user(data: dict, creator: Optional[User] = None) -> Dict[str, Any]:
    """
    Tạo tài khoản mới và ghi nhận nhật ký hoạt động
    """
    schema = UserCreateRequestDTO()
    validated = schema.load(data)

    username = validated["username"].strip().lower()
    email = validated["email"].strip().lower()
    password = validated["password"].strip()
    full_name = (validated.get("full_name") or username).strip()
    role = (validated.get("role") or RoleEnum.MANAGER.value).strip().lower()

    # Kiểm tra trùng username hoặc email
    if user_repo.get_user_by_username(username):
        raise ConflictError(message=f"Tên đăng nhập '{username}' đã được sử dụng.")
    if user_repo.get_user_by_email(email):
        raise ConflictError(message=f"Email '{email}' đã được sử dụng.")

    valid_roles = [RoleEnum.ADMIN.value, RoleEnum.MANAGER.value]
    if role not in valid_roles:
        role = RoleEnum.MANAGER.value

    new_user = user_repo.create_user(
        username=username,
        email=email,
        password=password,
        full_name=full_name,
        role=role,
        is_active=True,
        can_admin_access=True
    )

    # Ghi nhận Nhật ký hoạt động
    role_name = "Quản trị viên (Admin)" if role == RoleEnum.ADMIN.value else "Quản lý (Manager)"
    audit_service.log_activity(
        action="CREATE",
        module="Tài khoản",
        summary=f"Đã tạo tài khoản mới: '{username}' ({full_name}) với vai trò '{role_name}'",
        target_id=new_user.id,
        user=creator
    )

    return UserResponseDTO().dump(new_user.to_dict())


def update_user(user_id: int, data: dict, current_user: User) -> Dict[str, Any]:
    """
    Cập nhật tài khoản và ghi nhận thay đổi vào nhật ký
    """
    user = get_user_by_id(user_id)

    # Kiểm tra quyền: Chỉ Admin hoặc chính chủ
    if current_user.role != RoleEnum.ADMIN.value and current_user.id != user_id:
        raise ForbiddenError(message="Bạn không có quyền sửa thông tin tài khoản của người khác.")

    schema = UserUpdateRequestDTO()
    validated = schema.load(data)

    full_name = validated.get("full_name")
    email = validated.get("email")
    role = validated.get("role")
    password = validated.get("password")

    changes = {}

    if email and email.strip().lower() != user.email:
        new_email = email.strip().lower()
        if user_repo.get_user_by_email(new_email):
            raise ConflictError(message=f"Email '{new_email}' đã được sử dụng.")
        changes["email"] = {"old": user.email, "new": new_email}
        email = new_email
    else:
        email = None

    if full_name and full_name.strip() != user.full_name:
        changes["full_name"] = {"old": user.full_name, "new": full_name.strip()}
        full_name = full_name.strip()
    else:
        full_name = None

    # Chỉ Admin mới được đổi role
    if role and current_user.role == RoleEnum.ADMIN.value and role != user.role:
        if role in [RoleEnum.ADMIN.value, RoleEnum.MANAGER.value]:
            changes["role"] = {"old": user.role, "new": role}
        else:
            role = None
    else:
        role = None

    if password:
        changes["password"] = {"old": "******", "new": "Đã đổi mật khẩu mới"}

    updated_user = user_repo.update_user(
        user=user,
        full_name=full_name,
        email=email,
        role=role,
        password=password
    )

    # Ghi nhận Nhật ký nếu có sự thay đổi
    if changes:
        audit_service.log_activity(
            action="UPDATE",
            module="Tài khoản",
            summary=f"Đã cập nhật thông tin tài khoản: '{user.username}'",
            target_id=user.id,
            changes=changes,
            user=current_user
        )

    return UserResponseDTO().dump(updated_user.to_dict())


def toggle_admin_access(user_id: int, current_user: User) -> Dict[str, Any]:
    """
    Bật / Tắt quyền truy cập Admin của tài khoản
    """
    user = get_user_by_id(user_id)

    if user.id == current_user.id:
        raise BadRequestError(message="Bạn không thể tự tắt quyền truy cập Quản trị của chính mình.")

    updated_user = user_repo.toggle_admin_access(user)
    status_str = "kích hoạt" if updated_user.can_admin_access else "vô hiệu hóa"

    # Ghi log
    audit_service.log_activity(
        action="TOGGLE_ACCESS",
        module="Tài khoản",
        summary=f"Đã {status_str} quyền truy cập Admin cho tài khoản '{user.username}'",
        target_id=user.id,
        user=current_user
    )

    return UserResponseDTO().dump(updated_user.to_dict())


def authenticate_user(username_or_email: str, password: str) -> User:
    """
    Xác thực thông tin đăng nhập
    """
    identifier = (username_or_email or "").strip()
    if not identifier or not password:
        raise BadRequestError(message="Vui lòng nhập tên đăng nhập/email và mật khẩu.")

    user = user_repo.get_user_by_username_or_email(identifier)
    if not user or not user.check_password(password):
        raise BadRequestError(message="Tên đăng nhập hoặc mật khẩu không chính xác.")

    if not user.is_active:
        raise ForbiddenError(message="Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên.")

    if not user.can_admin_access:
        raise ForbiddenError(message="Tài khoản này đã bị tắt quyền đăng nhập vào khu vực Quản trị.")

    return user

