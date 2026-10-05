from .BaseModel import BaseModel
from extensions import db


class Award(BaseModel):
    __tablename__ = "award"
    id = db.Column(db.String(50), primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    decision_number = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255), nullable=True)
    icon = db.Column(db.String(255), nullable=True)
    props = db.Column(db.JSON, nullable=True)
    year = db.Column(db.Integer, nullable=True)
