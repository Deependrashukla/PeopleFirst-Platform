from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db
from routes import initialize_routes

# Initialize the app
app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object('config.Config')

# Initialize extensions
db.init_app(app)

# Register routes
initialize_routes(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all tables
    app.run(debug=True)

