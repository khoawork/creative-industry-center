from flask import Flask
from config import Config
from extensions import db
from utils.error import register_error_handlers
from flask_cors import CORS

try:
    from flasgger import Swagger
except Exception:
    Swagger = None

from models import *


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.json.ensure_ascii = False

    app.url_map.strict_slashes = False

    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "*"
    ]
    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    db.init_app(app)

    with app.app_context():
        db.create_all()
        try:
            from sqlalchemy import text

            migrations = [
                (
                    "event",
                    "event_date",
                    "ALTER TABLE event ADD COLUMN event_date DATE NULL AFTER location",
                ),
                (
                    "award",
                    "code",
                    "ALTER TABLE award ADD COLUMN code VARCHAR(50) NULL AFTER id",
                ),
                (
                    "award",
                    "icon",
                    "ALTER TABLE award ADD COLUMN icon VARCHAR(255) NULL AFTER image",
                ),
                (
                    "award",
                    "year",
                    "ALTER TABLE award ADD COLUMN year INT NULL AFTER props",
                ),
            ]
            for table, col, sql in migrations:
                try:
                    existing_cols = [
                        row[0]
                        for row in db.session.execute(
                            text(f"DESCRIBE `{table}`")
                        ).fetchall()
                    ]
                    if col not in existing_cols:
                        db.session.execute(text(sql))
                        db.session.commit()
                        app.logger.info(f"Schema migration: Added column {table}.{col}")
                except Exception as ex:
                    db.session.rollback()
                    app.logger.warning(
                        f"Schema migration skipped for {table}.{col}: {ex}"
                    )
        except Exception as e:
            app.logger.warning(f"Schema migrations check: {e}")

        try:
            from models.PageModel import Page

            if Page.query.count() == 0:
                from seed import seed_database

                seed_database()
        except Exception as e:
            app.logger.warning(f"Auto-seed check: {e}")

    if Swagger:
        swagger = Swagger(app)
    register_error_handlers(app)

    from controllers.UserController import user_api
    from controllers.TrainingController import training_api
    from controllers.pages.founder_controller import founder_page_api
    from controllers.pages.award_controller import award_page_api
    from controllers.HomeController import home_api
    from controllers.IntroduceController import introduce_api
    from controllers.BaseController import base_api
    from controllers.AwardController import award_api
    from controllers.EventController import event_api
    from controllers.ProjectController import project_api, category_project_api
    from controllers.ContactController import contact_api
    from controllers.pages.record_controller import record_page_api
    from controllers.FormController import form_api
    from controllers.ProjectPageController import project_page_api
    from controllers.TrainingPageController import training_page_api
    from controllers.SiteSettingsController import site_api

    app.register_blueprint(founder_page_api)
    app.register_blueprint(award_page_api)
    app.register_blueprint(user_api)
    app.register_blueprint(training_api)
    app.register_blueprint(event_api)
    app.register_blueprint(contact_api)
    app.register_blueprint(project_api)
    app.register_blueprint(category_project_api)
    app.register_blueprint(award_api)
    app.register_blueprint(home_api)
    app.register_blueprint(introduce_api)
    app.register_blueprint(base_api)
    app.register_blueprint(record_page_api)
    app.register_blueprint(form_api)
    app.register_blueprint(project_page_api)
    app.register_blueprint(training_page_api)
    app.register_blueprint(site_api)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.FLASK_DEBUG)
