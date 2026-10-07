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

    def to_dict(self):
        return {
            "id": self.id,
            "formId": self.form_id,
            "data": self.data,
            "syncedToSheet": self.synced_to_sheet,
            "sheetId": self.sheet_id,
            "syncError": self.sync_error,
            "createdDate": self.created_date.isoformat() if self.created_date else None,
            "updatedDate": self.updated_date.isoformat() if self.updated_date else None,
        }
