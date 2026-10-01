from flask import Flask
from config import Config
from extensions import db
from utils.error import register_error_handlers
from flask_cors import CORS

try:
    from flasgger import Swagger
except ImportError:
    Swagger = None

from models import *


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.json.ensure_ascii = False

    # Tắt strict_slashes để tránh Werkzeug tự 308 redirect giữa /events và /events/
    app.url_map.strict_slashes = False

    # Cấu hình CORS toàn diện cho frontend
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # 2. Khởi tạo SQLAlchemy
    db.init_app(app)

    # 3. Tự động tạo bảng vào MySQL
    with app.app_context():
        db.create_all()

    if Swagger:
        swagger = Swagger(app)
    register_error_handlers(app)
    


    # 3. Đăng ký các blueprints
    from controllers.HomeController import home_api
    from controllers.BaseController import base_api
    from controllers.AwardController import award_api


    from controllers.UserController import user_api
    from controllers.TrainingController import training_api
    from controllers.EventController import event_api
    from controllers.ProjectController import project_api, category_project_api

    app.register_blueprint(user_api)
    app.register_blueprint(training_api)
    app.register_blueprint(event_api)
    app.register_blueprint(project_api)
    app.register_blueprint(category_project_api)
    app.register_blueprint(award_api)
    app.register_blueprint(home_api)
    app.register_blueprint(base_api)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.FLASK_DEBUG)
