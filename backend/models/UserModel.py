from enum import Enum
from extensions import db
from .BaseModel import BaseModel


class RoleEnum(str, Enum):
    ADMIN = "admin"
    USER = "user"


class User(BaseModel):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    avatar = db.Column(db.String(255), default="/static/image/icon_user.png")
    role = db.Column(db.Enum(RoleEnum), default=RoleEnum.USER, nullable=False)
