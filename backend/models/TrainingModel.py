from .BaseModel import BaseModel
from extensions import db

training_category_association = db.Table(
    "training_category_association",
    db.Column(
        "training_id", db.Integer, db.ForeignKey("training.id"), primary_key=True
    ),
    db.Column(
        "category_id",
        db.Integer,
        db.ForeignKey("training_category.id"),
        primary_key=True,
    ),
)


class Training(BaseModel):
    __tablename__ = "training"
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    props = db.Column(db.JSON, nullable=False)
    certificate = db.Column(db.String(255), nullable=False)


class TrainingCategory(BaseModel):
    __tablename__ = "training_category"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    trainings = db.relationship(
        "Training",
        secondary="training_category_association",
        backref="categories",
    )
