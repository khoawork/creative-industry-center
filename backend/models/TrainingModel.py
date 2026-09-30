from .BaseModel import BaseModel
from extensions import db

class Training(BaseModel):
    __tablename__ = "training"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    time = db.Column(db.Date, nullable=False)
    props = db.Column(db.JSON, nullable=False)
    certificate = db.Column(db.String(255), nullable=False)