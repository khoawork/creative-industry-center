from extensions import db
from .BaseModel import BaseModel

class FormSubmission(BaseModel):
    __tablename__ = "form_submission"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    form_id = db.Column(db.String(100), nullable=False, index=True)
    data = db.Column(db.JSON, nullable=False)
    synced_to_sheet = db.Column(db.Boolean, default=False, nullable=False)
    sheet_id = db.Column(db.String(255), nullable=True)
    sync_error = db.Column(db.Text, nullable=True)
    is_read = db.Column(db.Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "formId": self.form_id,
            "data": self.data,
            "syncedToSheet": self.synced_to_sheet,
            "sheetId": self.sheet_id,
            "syncError": self.sync_error,
            "isRead": self.is_read,
            "createdDate": self.created_date.isoformat() if self.created_date else None,
            "updatedDate": self.updated_date.isoformat() if self.updated_date else None,
        }

    def to_message_dict(self):
        data = self.data or {}
        full_name = data.get("fullName") or data.get("name") or data.get("sender") or "Khách liên hệ"
        parts = [p for p in full_name.split() if p]
        initials = "".join([p[0].upper() for p in parts[-2:]]) if len(parts) >= 2 else (parts[0][:2].upper() if parts else "KH")

        category = data.get("category") or data.get("subject")
        if not category:
            if self.form_id == "contact_feedback":
                category = "Liên hệ & Góp ý"
            elif self.form_id == "event_newsletter":
                category = "Đăng ký nhận tin sự kiện"
            elif self.form_id == "training_registration":
                category = "Đăng ký khóa đào tạo"
            else:
                category = f"Phản hồi từ {self.form_id}"

        message_body = data.get("message") or data.get("note") or data.get("content") or ""
        extra_lines = []
        if data.get("email"):
            extra_lines.append(f"Email: {data.get('email')}")
        if data.get("phone"):
            extra_lines.append(f"Số điện thoại: {data.get('phone')}")
        if data.get("organization"):
            extra_lines.append(f"Tổ chức / Đơn vị: {data.get('organization')}")
        if data.get("courseCode"):
            extra_lines.append(f"Mã khóa học: {data.get('courseCode')}")

        full_body = message_body
        if extra_lines:
            contact_info_text = "\n".join(extra_lines)
            full_body = f"{message_body}\n\n---\nThông tin liên hệ:\n{contact_info_text}" if message_body else contact_info_text

        return {
            "id": self.id,
            "sender": full_name,
            "initials": initials,
            "subject": category,
            "body": full_body or "Không có nội dung tin nhắn chi tiết.",
            "receivedAt": self.created_date.isoformat() if self.created_date else None,
            "unread": not self.is_read,
            "formId": self.form_id,
            "rawData": data
        }

