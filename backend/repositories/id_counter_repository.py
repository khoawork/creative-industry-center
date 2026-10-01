from sqlalchemy import select
from sqlalchemy.dialects.mysql import insert

from extensions import db
from models import IdCounter


def generate_id(prefix: str):
    statement = insert(IdCounter).values(prefix=prefix, last_number=1)

    statement = statement.on_duplicate_key_update(
        last_number=IdCounter.last_number + 1,
    )

    db.session.execute(statement)

    number = db.session.execute(
        select(IdCounter.last_number)
        .where(IdCounter.prefix == prefix)
        .with_for_update()
    ).scalar_one()

    return f"{prefix}-{number:02d}"