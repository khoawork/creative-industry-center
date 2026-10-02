from app import db
try:
    from models.BaseModel import BaseModel
except ImportError:
    from BaseModel import BaseModel


class Trainning(BaseModel):
    __tablename__ = "trainning"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    time = db.Column(db.String(100), nullable=True)
    trainning_info = db.Column(db.JSON, nullable=True)
    certificate = db.Column(db.String(255), nullable=True)

    # Khóa ngoại trỏ đến category_trainning
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("category_trainning.id", ondelete="SET NULL"),
        nullable=True
    )

    # Quan hệ với CategoryTrainning
    category = db.relationship("CategoryTrainning", back_populates="trainnings")

    # Quan hệ nhiều-nhiều với Page qua AssociationClass3
    pages = db.relationship(
        "Page",
        secondary="association_class_3",
        back_populates="trainnings"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "time": self.time,
            "trainning_info": self.trainning_info,
            "certificate": self.certificate,
            "category_id": self.category_id,
            "category": self.category.name if self.category else None,
            "created_date": self.created_date.isoformat() if self.created_date else None,
            "updated_date": self.updated_date.isoformat() if self.updated_date else None,
        }
