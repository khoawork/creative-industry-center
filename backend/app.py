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


    # 2. Khởi tạo SQLAlchemy
    db.init_app(app)

    # 3. Tự động tạo bảng vào MySQL
    with app.app_context():
            db.create_all()

    if Swagger:
        swagger = Swagger(app)  
    register_error_handlers(app)
   
    app.register_blueprint(user_api)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        debug=Config.FLASK_DEBUG
    )