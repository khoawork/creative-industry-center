from typing import Optional, List
from extensions import db
from models.UserModel import User, RoleEnum


def get_user_by_id(user_id: int) -> Optional[User]:
    """Tìm người dùng theo ID"""
    return User.query.get(user_id)


def get_user_by_username(username: str) -> Optional[User]:
    """Tìm người dùng theo username"""
    return User.query.filter_by(username=username).first()


def get_user_by_email(email: str) -> Optional[User]:
    """Tìm người dùng theo email"""
    return User.query.filter_by(email=email).first()


def get_user_by_username_or_email(identifier: str) -> Optional[User]:
    """Tìm người dùng theo username hoặc email phục vụ xác thực đăng nhập"""
    return User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()


def get_all_users() -> List[User]:
    """Lấy danh sách tất cả người dùng trong hệ thống"""
    return User.query.order_by(User.id.asc()).all()


def create_user(
    username: str,
    email: str,
    password: str,
    full_name: Optional[str] = None,
    role: str = RoleEnum.MANAGER.value,
    is_active: bool = True,
    can_admin_access: bool = True
) -> User:
    """Tạo người dùng mới và băm mật khẩu"""
    new_user = User(
        username=username,
        email=email,
        full_name=full_name or username,
        role=role,
        is_active=is_active,
        can_admin_access=can_admin_access
    )
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return new_user


def update_user(
    user: User,
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    role: Optional[str] = None,
    password: Optional[str] = None
) -> User:
    """Cập nhật thông tin người dùng"""
    if full_name is not None:
        user.full_name = full_name
    if email is not None:
        user.email = email
    if role is not None:
        user.role = role
    if password:
        user.set_password(password)
    db.session.commit()
    return user


def toggle_admin_access(user: User) -> User:
    """Bật / tắt quyền truy cập Admin của người dùng"""
    user.can_admin_access = not user.can_admin_access
    db.session.commit()
    return user

