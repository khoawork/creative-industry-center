from flask import Flask
from config import Config
from extensions import db
from utils.error import register_error_handlers
from controllers.UserController import user_api
try:
    from flasgger import Swagger
except ImportError:
    Swagger = None

from models import *


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.json.ensure_ascii = False

    # 1. Khởi tạo SQLAlchemy
    db.init_app(app)

    # 2. Tự động tạo bảng vào MySQL
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"[CANH BAO] Khong the ket noi Database: {e}")

    if Swagger:
        swagger = Swagger(app)  
    register_error_handlers(app)
   
    # 3. Đăng ký các blueprints
    from controllers.UserController import user_api
    from controllers.HomeController import home_api
    from controllers.BaseController import base_api
    from controllers.AwardController import award_api
    from controllers.TrainingController import training_api

    app.register_blueprint(user_api)
    app.register_blueprint(award_api)
    app.register_blueprint(training_api)
    app.register_blueprint(home_api)
    app.register_blueprint(base_api)

    return app


app = create_app()

if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        debug=Config.FLASK_DEBUG
    )