from datetime import datetime
from extensions import db


class ActivityLog(db.Model):
    __tablename__ = "activity_log"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    user_name = db.Column(db.String(100), nullable=False)
    user_role = db.Column(db.String(50), nullable=False)
    action = db.Column(db.String(50), nullable=False)       # CREATE, UPDATE, DELETE, REORDER, TOGGLE_ACCESS
    module = db.Column(db.String(100), nullable=False)      # Menu & Điều hướng, Tài khoản, Sự kiện, Bài viết...
    target_id = db.Column(db.Integer, nullable=True)
    summary = db.Column(db.String(500), nullable=False)     # Câu mô tả tiếng Việt
    changes = db.Column(db.JSON, nullable=True)             # Chi tiết các trường thay đổi
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "user_role": self.user_role,
            "action": self.action,
            "module": self.module,
            "target_id": self.target_id,
            "summary": self.summary,
            "changes": self.changes or {},
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

