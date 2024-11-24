from flask import Blueprint

user_bp = Blueprint('users', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    return {'message': 'User routes are under construction'}
