from .BaseModel import BaseModel
from extensions import db

class Award(BaseModel):
    __tablename__ = "award"
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    decision_number = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    props = db.Column(db.JSON, nullable=True)