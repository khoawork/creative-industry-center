from extensions import db

class IdCounter(db.Model):
    __tablename__ = "id_counter"
    __table_args__ = {"mysql_engine": "InnoDB"}

    prefix = db.Column(db.String(30), primary_key=True)
    last_number = db.Column(db.BigInteger, nullable=False, default=0)