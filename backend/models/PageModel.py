from .BaseModel import BaseModel
from extensions import db


class Page(BaseModel):
    __tablename__ = "page"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False)
    props = db.Column(db.JSON, nullable=False)
    is_visible = db.Column(db.Boolean, default=True, nullable=False)
    order_index = db.Column(db.Integer, default=0, nullable=False)

