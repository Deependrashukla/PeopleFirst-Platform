from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import pusher
import firebase_admin
from firebase_admin import credentials, storage

# Firebase Initialization
# cred = credentials.Certificate(r"C:\Users\LENOVO\Downloads\peoplefirst-caba5-firebase-adminsdk-yhvto-516641ae4b.json")
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'peoplefirst-caba5.appspot.com'
# })

# Flask App Initialization
app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://helpernest_user:AZt1yiyILymT3QWR6E7ULQ8IXsGWAu7U@dpg-csmvvmij1k6c73dpeh9g-a.oregon-postgres.render.com/helpernest'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Pusher Configuration
pusher_client = pusher.Pusher(
    app_id='1902004',
    key='be108580dd11495c66aa',
    secret='be987806344c4329b0bc',
    cluster='ap2',
    ssl=True
)

# ----------------------------- MODELS -----------------------------

# User Table (For homeowners/service requesters)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f"<User {self.first_name} {self.last_name}>"

# Worker Login Table
class WorkerLogin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))

    def __repr__(self):
        return f"<WorkerLogin {self.email}>"

# Worker Table
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
    aadhaar_card_photo = db.Column(db.String(255), nullable=True)
    worker_photo = db.Column(db.String(255), nullable=True)

    # Relationships to Work Table
    works = db.relationship('Work', backref='worker', lazy=True)

    def __repr__(self):
        return f"<Worker {self.first_name} {self.last_name}>"

# Work Table
class Work(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'completed', 'in-progress', or 'awaiting'
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)

    def __repr__(self):
        return f"<Work {self.title}>"

# Availability Table
class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    is_available = db.Column(db.Boolean, default=True, nullable=False)

    worker = db.relationship('Worker', backref='availabilities')

    def __repr__(self):
        return f"<Availability Worker {self.worker_id}, {self.start_time} - {self.end_time}>"

# Appointment Table
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')

    user = db.relationship('User', backref='appointments')
    worker = db.relationship('Worker', backref='appointments')

    def __repr__(self):
        return f"<Appointment User {self.user_id}, Worker {self.worker_id}, Status {self.status}>"

# ----------------------------- ROUTES -----------------------------

@app.route('/register-user', methods=['POST'])
def register_user():
    data = request.get_json()
    new_user = User(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        mobile=data.get('mobile')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/register-worker', methods=['POST'])
def register_worker():
    data = request.get_json()
    new_worker = Worker(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        address=data.get('address'),
        pincode=data.get('pincode'),
        occupation=data.get('occupation'),
        aadhaar_number=data.get('aadhaar_number'),
        experience=data.get('experience'),
        mobile=data.get('mobile'),
        dob=datetime.strptime(data.get('dob'), '%Y-%m-%d'),
        age=data.get('age'),
        email=data.get('email'),
        aadhaar_card_photo=data.get('aadhaar_card_photo'),
        worker_photo=data.get('worker_photo')
    )
    db.session.add(new_worker)
    db.session.commit()
    return jsonify({'message': 'Worker registered successfully!'}), 201

@app.route('/add-appointment', methods=['POST'])
def add_appointment():
    data = request.get_json()
    new_appointment = Appointment(
        user_id=data.get('user_id'),
        worker_id=data.get('worker_id'),
        service_type=data.get('service_type'),
        appointment_time=datetime.strptime(data.get('appointment_time'), '%Y-%m-%dT%H:%M'),
        status=data.get('status', 'pending')
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment created successfully!'}), 201

@app.route('/list-appointments', methods=['GET'])
def list_appointments():
    appointments = Appointment.query.all()
    return jsonify([{
        'id': appointment.id,
        'user_id': appointment.user_id,
        'worker_id': appointment.worker_id,
        'service_type': appointment.service_type,
        'appointment_time': appointment.appointment_time.strftime('%Y-%m-%d %H:%M:%S'),
        'status': appointment.status
    } for appointment in appointments]), 200
    
import razorpay

razorpay_client = razorpay.Client(auth=("rzp_test_jrhUMjijQQywXQ", "vAWsD9TOjoc9SAWbVQ3jUJjX"))

@app.route('/create-order', methods=['POST'])
def create_order():
    data = request.get_json()
    amount = data.get('amount')  # Amount in paise

    # Create an order using Razorpay API
    order = razorpay_client.order.create({
        'amount': amount,
        'currency': 'INR',
        'payment_capture': '1',  # Automatic capture
    })

    order_id = order['id']

    # Return the order ID and Razorpay key to the frontend
    return jsonify({
        'order_id': order_id,
        'razorpay_key': 'vAWsD9TOjoc9SAWbVQ3jUJjX'  # Use your Razorpay API key here
    })
    
@app.route('/verify-payment', methods=['POST'])
def verify_payment():
    data = request.get_json()
    payment_id = data.get('payment_id')
    order_id = data.get('order_id')
    signature = data.get('razorpay_signature')

    # Verify the payment signature using Razorpay's SDK
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        })
        # Payment is valid
        return jsonify({'status': 'Payment successful'})
    except razorpay.errors.SignatureVerificationError:
        # Invalid payment signature
        return jsonify({'status': 'Payment verification failed'}), 400

# ----------------------------- MAIN -----------------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if not already present
    app.run(debug=True)
