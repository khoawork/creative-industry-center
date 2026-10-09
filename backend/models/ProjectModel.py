from .BaseModel import BaseModel
from extensions import db


class Project(BaseModel):
    __tablename__ = "project"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(50), nullable=True)
    name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    research_info = db.Column(db.JSON, nullable=True)
    project_info = db.Column(db.JSON, nullable=True)
    slogan = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(500), nullable=True)

    category_id = db.Column(
        db.Integer, db.ForeignKey("project_category.id"), nullable=False
    )
    category = db.relationship("ProjectCategory", backref="projects")


class ProjectCategory(BaseModel):
    __tablename__ = "project_category"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
