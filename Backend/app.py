from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import pusher
import firebase_admin
from firebase_admin import credentials, storage
from firebase import verify_firebase_token

# Firebase Initialization
cred = credentials.Certificate(r"C:\Users\LENOVO\Downloads\peoplefirst-caba5-firebase-adminsdk-yhvto-516641ae4b.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'padhai-abab6.appspot.com'
})

# Flask App Initialization
app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://helpernest_user:AZt1yiyILymT3QWR6E7ULQ8IXsGWAu7U@dpg-csmvvmij1k6c73dpeh9g-a.oregon-postgres.render.com/helpernest'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Pusher Configuration
pusher_client = pusher.Pusher(
    app_id='1844084',
    key='b472bc7e618991d3b479',
    secret='8334db82088d20cfa941',
    cluster='ap2',
    ssl=True
)

# ----------------------------- MODELS -----------------------------

# User Table (For homeowners/service requesters)
class User(db.Model):  # Note: Capitalize class names by convention
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Auto-increment ID
    #uid = db.Column(db.String(100), unique=True)  # Changed to unique instead of primary_key
    uid = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))


# Worker Table
class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
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
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=True )  # Foreign key linking to Worker
    imageurl = db.Column(db.String(255), nullable=True)
    aadhaar_number = db.Column(db.String(12), nullable=False)

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


class Appoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    worker_aadhar = db.Column(db.String(100), nullable=False)
    
@app.route("/get_appointment", methods=['POST'])
def get_appointment():
    data = request.get_json()
    worker_aadhar = data.get('aadhar_number')  # Ensure this matches the field name

    appointments_data = Appoint.query.filter_by(worker_aadhar=str(worker_aadhar)).all()
    print("appointments_data", appointments_data)
    
    # If no data found, return an empty response or a message
    if not appointments_data:
        return jsonify({"message": "No appointments found", "data": []})
    
    # Convert each appointment object to a dictionary
    appointments_list = [
        {
            "id": appointment.id,
            "user_email": appointment.user_email,
            "service_type": appointment.service_type,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status,
            "worker_aadhar": appointment.worker_aadhar
        }
        for appointment in appointments_data
    ]
    
    return jsonify({"message": "Successfully fetched the data", "data": appointments_list})


@app.route("/get_user_data", methods=['POST'])  # Make sure it's POST method
def get_user_data():
    data = request.get_json()
    email = data.get('email')

    # Query user by email
    user_data = Worker.query.filter_by(email=email).first()  # Use first() to get one result

    if user_data is None:
        return jsonify({"message": "User not found", "data": {}})

    # Return the user data, adjust to match your user object structure
    return jsonify({"message": "Successfully fetched the data", "data": {
        "email": user_data.email,
        "aadhar_number": user_data.aadhaar_number
    }})


@app.route("/post_appointment", methods=['POST'])
def post_appointment():
    data = request.get_json()
    user_email = data.get("user_email")
    service_type = data.get("service_type")
    appointment_time = data.get("appointment_time")
    status = data.get("status")
    worker_aadhar = data.get("worker_aadhar")
    
    appoint = Appoint(
        user_email = user_email,
        service_type = service_type,
        appointment_time = appointment_time,
        status = status,
        worker_aadhar = worker_aadhar
    )
    
    db.session.add(appoint)
    db.session.commit()
    return jsonify({"message": "Succesfully added the appointment"}), 201

    
# ----------------------------- ROUTES -----------------------------
appointments_data = {
    "worker1": [
        {"title": "Fix Broken Pipe", "description": "Fix the leaking pipe in kitchen", "status": "pending"},
        {"title": "Install New AC", "description": "Install the AC in living room", "status": "pending"},
    ],
    "worker2": [
        {"title": "Repair Car Engine", "description": "Repair the engine of the car", "status": "approved"},
    ]
}



@app.route('/add-worker-deatils', methods=['POST'])
def register_worker():
    data = request.get_json()
    print(data)
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


@app.route('/get-worker-appointments', methods=['GET'])
def get_worker_appointments():
    try:
        # Get the token from Authorization header
        decoded_token, error_response = verify_firebase_token()
        print(decoded_token)
        if error_response:
            return jsonify(error_response)

        email = decoded_token.get('email')
        # Fetch appointments for the worker (this is just a mock; replace with actual data from DB)
        worker_appointments = appointments_data.get(user_id, [])

        if worker_appointments:
            return jsonify({"success": True, "workerData": {"appointments": worker_appointments}})
        else:
            return jsonify({"success": False, "message": "No appointments found."})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


# Endpoint to book an appointment
@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    try:
        # Get the token from Authorization header
        decoded_token, error_response = verify_firebase_token()
        print(decoded_token)
        if error_response:
            return jsonify(error_response)

        email = decoded_token.get('email')

        # Get the data from the request body
        data = request.get_json()
        event_id = data.get('eventId')
        aadhaar_number = data.get('aadhaar_number')

        # In a real scenario, save the booking request to a database
        # For now, just return a mock success message
        # Here you would normally send the appointment request to the worker

        print(f"Appointment booked by user {user_email} (UID: {user_id}) for event {event_id} with Aadhaar {aadhaar_number}")

        return jsonify({"success": True, "message": "Appointment request sent successfully to the worker!"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@app.route('/add-work', methods=['POST'])
def add_listworker():
    decoded_token, error_response = verify_firebase_token()
    print(decoded_token)
    if error_response:
        return jsonify(error_response)

    email = decoded_token.get('email')
    data = request.get_json()  # Use get_json() to parse JSON body
    print(data)
    print('sonal')

    # Check if start_time and end_time are in the request data and are not None
    start_time_str = data.get('startTime')
    end_time_str = data.get('endTime')

    if not start_time_str or not end_time_str:
        return jsonify({'message': 'Start time and end time are required'}), 400

    try:
        start_time = datetime.strptime(start_time_str, '%Y-%m-%dT%H:%M')
        end_time = datetime.strptime(end_time_str, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use "YYYY-MM-DDTHH:mm"'}), 400

    # Now create the new listworker object
    new_listworker = Work(
        title=data.get('title'),
        description=data.get('description'),
        price=data.get('priceRange'),
        city=data.get('place'),
        imageurl=data.get('imageurl'), 
        start_time=start_time,
        end_time=end_time,
        aadhaar_number = data.get("aadhaarNumber"),
        status = 'not-completed'
        
    )

    db.session.add(new_listworker)
    db.session.commit()

    return jsonify({'message': 'ListWorker added successfully'}), 201





    
# @app.route('/', methods=['GET'])
# def log():
#     return {'result'}
#oute to handle login
@app.route('/login', methods=['POST'])
def login():
    decoded_token, error_response = verify_firebase_token()
    if error_response:
        return jsonify(error_response)

    email = decoded_token.get('email')
    #data = request.get_json()
    return jsonify({'message': "login succesful"})


    
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    email = data.get('email')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    uid=data.get("uid")
    
    # if not email or not password:
    #     return jsonify({'message': 'Email and password are required'}), 400

    # Check if the worker already exists
    # existing_worker = User.query.filter_by(email=email).first()
    # if existing_worker:
    #     return jsonify({'message': 'Worker already registered'}), 409
    # Create a new worker
    new_worker = User(first_name=first_name, last_name = last_name, email=email, uid = uid)  # Hash the password in a real scenario
    db.session.add(new_worker)
    db.session.commit()
    return jsonify({'message': 'Worker registered successfully'}), 201
        

@app.route('/listwork', methods=['GET'])
def get_listworkers():
    # decoded_token, error_response = verify_firebase_token()
    # if error_response:
    #     return jsonify(error_response)
    # email = decoded_token.get('email')
    city = request.args.get('city')
    category = request.args.get('category')
    # listworkers = Work.query.filter(
    #     (Work.city == city if city else True),  # Filter by city if it's defined
    #     Work.title == category  # Always filter by category
    # ).all()
    # Log the incoming query parameters for debugging
    print(f"Received city: {city}, category: {category}")

    # Validate input
    if not category:
        return jsonify({'message': 'Category is required parameters'}), 400

    try:
        # Query the ListWorker table with the given city and category
        listworkers = Work.query.filter(
            (Work.city == city if city else True),  # Filter by city if it's defined
            Work.title == category  # Always filter by category
        ).all()
        
        print("listworker: ", listworkers)
        # Return results as JSON
        return jsonify([{
            'id': listworker.id,
            'title': listworker.title,
            'work_description': listworker.description,
            'price': listworker.price,
            'city': listworker.city,
            'imageurl': listworker.imageurl,
            'start_time': listworker.start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': listworker.end_time.strftime('%Y-%m-%d %H:%M:%S'),
            'aadhaar_number' : listworker.aadhaar_number
        } for listworker in listworkers]), 200

    except Exception as e:
        # Log and return a general error message if any issue occurs during the query
        print(f"Error: {str(e)}")
        return jsonify({'message': 'An error occurred while processing the request'}), 500

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
    amount = data.get('amount')  

    order = razorpay_client.order.create({
        'amount': amount,
        'currency': 'INR',
        'payment_capture': '1',  
    })

    order_id = order['id']

    return jsonify({
        'order_id': order_id,
        'razorpay_key': 'vAWsD9TOjoc9SAWbVQ3jUJjX'})


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
    
@app.route('/api/details/<aadhaar_number>', methods=['GET'])
def details(aadhaar_number):
    print(aadhaar_number)

    # Log the received data
    # print("Received data:", aadhaar_number)
    # Query your aadhaar_numberbase or perform operations
    return jsonify({'aadhaar_number': aadhaar_number})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if not already present
    app.run(debug=True)
