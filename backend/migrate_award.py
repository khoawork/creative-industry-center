from sqlalchemy import inspect, text

from app import create_app
from extensions import db

app = create_app()

with app.app_context():
    inspector = inspect(db.engine)
    columns = {column["name"] for column in inspector.get_columns("award")}
    additions = {
        "code": "VARCHAR(50) NULL",
        "icon": "VARCHAR(255) NULL",
        "year": "INT NULL",
    }

    for column, definition in additions.items():
        if column not in columns:
            db.session.execute(
                text(f"ALTER TABLE award ADD COLUMN {column} {definition}")
            )

    db.session.execute(
        text("UPDATE award SET code = id WHERE code IS NULL OR code = ''")
    )
    db.session.execute(
        text("ALTER TABLE award MODIFY COLUMN code VARCHAR(50) NOT NULL")
    )

    indexes = {index["name"] for index in inspector.get_indexes("award")}
    if "uq_award_code" not in indexes:
        db.session.execute(
            text("ALTER TABLE award ADD CONSTRAINT uq_award_code UNIQUE (code)")
        )

    db.session.commit()
    print("Award schema migration completed.")
