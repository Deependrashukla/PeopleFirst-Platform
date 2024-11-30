from firebase_admin import auth
from flask import jsonify, request

def verify_firebase_token():
    auth_header = request.headers.get('Authorization')
    
    if auth_header and auth_header.startswith('Bearer '):
        id_token = auth_header.split('Bearer ')[1]
    else:
        return None, {'error': 'Authorization token is missing'}
    
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token, None
    except Exception as e:
        print(f"Error verifying ID token: {e}")
        return None, {'error': 'Invalid token or unauthorized access'}