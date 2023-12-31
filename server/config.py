# config.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
import os
from secret_keys import secret_key

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["SESSION_COOKIE_SAMESITE"] = "none"
# app.config["SESSION_COOKIE_SECURE"] = "true"
app.config["SECRET_KEY"] = "your_secret_key"
socketio = SocketIO(app)
flask_bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
