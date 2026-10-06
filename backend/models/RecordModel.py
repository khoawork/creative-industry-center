from sqlalchemy import Column, String, Text, JSON
from .BaseModel import BaseModel


class Record(BaseModel):
    __tablename__ = "record"
    id = Column(String(50), primary_key=True)
    rank = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    cycle = Column(String(50), nullable=True)
    criteria = Column(JSON, nullable=True)
    category = Column(String(255), nullable=True)
    icon = Column(String(255), nullable=True)
    action = Column(JSON, nullable=True)
