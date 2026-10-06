
from extensions import db
from sqlalchemy import func


class BaseModel(db.Model):
    __abstract__ = True
    
    created_date = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_date = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
