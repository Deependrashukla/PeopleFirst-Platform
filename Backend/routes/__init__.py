from flask import Blueprint
from .worker_routes import worker_bp
from .user_routes import user_bp

def initialize_routes(app):
    app.register_blueprint(worker_bp)
    app.register_blueprint(user_bp)
