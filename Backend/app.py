from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
import pymysql
from flask_cors import CORS
from datetime import datetime

# Initialize the Flask app
app = Flask(__name__)
CORS(app)
# Configure MySQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Shourya22@localhost:3306/mydatabase'

#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Shourya22%40%40localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define a model for Workers (assuming you have a workers table)
class Worker_login(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    
    
class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    pincode = db.Column(db.String(6), nullable=False)
    occupation = db.Column(db.String(100), nullable=False)
    aadhaar_number = db.Column(db.String(12), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    mobile = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    aadhaar_card_photo = db.Column(db.String(255), nullable=True)  # Storing filename/path
    worker_photo = db.Column(db.String(255), nullable=True)  # Storing filename/path

    def __repr__(self):
        return f'<Worker {self.first_name} {self.last_name}>'
    
@app.route('/', methods=['GET'])
def log():
    return {'name': 'sonal'}

# Route to handle login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Extract email and password from the request body
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    # Check if the worker exists in the database
    worker = Worker_login.query.filter_by(email=email).first()

    if worker:
        if worker.password == password:
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401
    else:
        # If the worker does not exist, create a new one
        new_worker = Worker_login(email=email, password=password)  # Hash the password in a real scenario
        db.session.add(new_worker)  # Add the new worker to the session
        db.session.commit()  # Commit the session to save changes
        return jsonify({'message': 'Worker registered and login successful'}), 201
    
@app.route('/register-worker', methods=['POST'])
def register_worker():
    data = request.json
    
    # Create a new Worker object
    new_worker = Worker(
        first_name=data.get('firstName'),
        last_name=data.get('lastName'),
        address=data.get('address'),
        pincode=data.get('pincode'),
        occupation=data.get('occupation'),
        aadhaar_number=data.get('aadhaarNumber'),
        experience=data.get('experience'),
        mobile=data.get('mobile'),
        dob=datetime.strptime(data.get('dob'), '%Y-%m-%d'),
        age=data.get('age'),
        email=data.get('email'),
        aadhaar_card_photo=data.get('aadhaarCardPhoto'),
        worker_photo=data.get('workerPhoto')
    )

    # Add the new worker to the session and commit to the database
    db.session.add(new_worker)
    db.session.commit()

    return jsonify({'message': 'Worker registered successfully'}), 201

# Route to get all workers
@app.route('/workers', methods=['GET'])
def get_workers():
    workers = Worker.query.all()
    return jsonify([{
        'id': worker.id,
        'first_name': worker.first_name,
        'last_name': worker.last_name,
        'address': worker.address,
        'pincode': worker.pincode,
        'occupation': worker.occupation,
        'aadhaar_number': worker.aadhaar_number,
        'experience': worker.experience,
        'mobile': worker.mobile,
        'dob': worker.dob.strftime('%Y-%m-%d'),
        'age': worker.age,
        'email': worker.email,
        'aadhaar_card_photo': worker.aadhaar_card_photo,
        'worker_photo': worker.worker_photo
    } for worker in workers]), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the table if it doesn't exis
    app.run(debug=True)