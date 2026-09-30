from .BaseModel import BaseModel
from extensions import db

class Project(BaseModel):
    __tablename__ = "project"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    research_info=db.Column(db.JSON, nullable=True)
    project_info = db.Column(db.JSON, nullanle=True)
    slogan = db.Column(db.String(255), nullable=False)