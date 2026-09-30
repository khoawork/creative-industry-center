from .BaseModel import BaseModel
from extensions import db

class Award(BaseModel):
    __tablename__ = "award"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    decision_number = db.Column(db.Text, nullable=True)