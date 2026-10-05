
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
    ]
    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    db.init_app(app)

    with app.app_context():
        db.create_all()

    if Swagger:
        swagger = Swagger(app)
    register_error_handlers(app)
    

    from controllers.UserController import user_api
    from controllers.TrainingController import training_api
    from controllers.pages.founder_controller import founder_page_api
    from controllers.HomeController import home_api
    from controllers.IntroduceController import introduce_api
    from controllers.BaseController import base_api
    from controllers.AwardController import award_api
    from controllers.EventController import event_api
    from controllers.ProjectController import project_api, category_project_api
    from controllers.ProjectPageController import project_page_api
    from controllers.TrainingPageController import training_page_api

    app.register_blueprint(founder_page_api)
    app.register_blueprint(user_api)
    app.register_blueprint(training_api)
    app.register_blueprint(event_api)
    app.register_blueprint(project_api)
    app.register_blueprint(category_project_api)
    app.register_blueprint(award_api)
    app.register_blueprint(home_api)
    app.register_blueprint(introduce_api)
    app.register_blueprint(base_api)
    app.register_blueprint(project_page_api)
    app.register_blueprint(training_page_api)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.FLASK_DEBUG)
