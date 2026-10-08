from datetime import datetime
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from .BaseModel import BaseModel


class RoleEnum(str, Enum):
    ADMIN = "admin"        # Toàn quyền hệ thống & tạo tài khoản, phân quyền
    MANAGER = "manager"    # Quản trị toàn bộ nội dung & hệ thống, TRỪ tạo tài khoản


class User(BaseModel):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    avatar = db.Column(db.String(255), default="/static/image/icon_user.png")
    role = db.Column(db.String(30), default=RoleEnum.MANAGER.value, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    can_admin_access = db.Column(db.Boolean, default=True, nullable=False)
    last_login_at = db.Column(db.DateTime, nullable=True)
    refresh_token_hash = db.Column(db.String(255), nullable=True)

    def set_password(self, raw_password: str) -> None:
        """Mã hóa và lưu mật khẩu"""
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Kiểm tra mật khẩu nhập vào"""
        if not self.password:
            return False
        return check_password_hash(self.password, raw_password)

    def has_admin_access(self) -> bool:
        """Kiểm tra tài khoản có được phép vào khu vực admin hay không"""
        if not self.is_active or not self.can_admin_access:
            return False
        return self.role in [RoleEnum.ADMIN.value, RoleEnum.MANAGER.value]

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name or self.username,
            "avatar": self.avatar,
            "role": self.role,
            "is_active": self.is_active,
            "can_admin_access": self.can_admin_access,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
            "created_date": self.created_date.isoformat() if hasattr(self, "created_date") and self.created_date else None,
        }
