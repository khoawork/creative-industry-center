from extensions import db
from .BaseModel import BaseModel


class SiteSettings(BaseModel):
    __tablename__ = "site_settings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    logo = db.Column(db.String(500), nullable=True)
    company_name = db.Column(db.String(255), nullable=False)
    company_tagline = db.Column(db.String(500), nullable=True)
    footer = db.Column(db.JSON, nullable=False, default=dict)