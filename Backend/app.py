from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import pusher
import firebase_admin
from firebase_admin import credentials, storage
from firebase import verify_firebase_token
import requests

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
    uid = db.Column(db.String(100), unique=True)  # Changed to unique instead of primary_key
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    choice = db.Column(db.Boolean, nullable=True)

# Worker Login Table
# class WorkerLogin(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     first_name = db.Column(db.String(100))
#     last_name = db.Column(db.String(100))

#     def __repr__(self):
#         return f"<WorkerLogin {self.email}>"

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
@app.route('/add-choice', methods=['POST'])
def add_choice():
    data = request.get_json()
    print("Received data:", data)  # Debugging log

    # Validate payload
    email = data.get('email')
    choice = data.get('choice')
    if not email or not choice:
        return jsonify({'error': 'Email and choice are required'}), 400

    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update user's choice
    user.choice = choice
    db.session.commit()

    return jsonify({'message': 'Choice updated successfully!'}), 200

@app.route('/get-choice', methods=['POST'])
def get_choice():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'choice': user.choice}), 200


@app.route('/listworkers', methods=['GET'])
def get_listworkers():
    print("deependra")
    # decoded_token, error_response = verify_firebase_token()
    # if error_response:
    #     return jsonify(error_response)

    # email = decoded_token.get('email')
    city = request.args.get('city')
    category = request.args.get('category')

    # Log the incoming query parameters for debugging
    print(f"Received city: {city}, category: {category}")

    # Validate input
    if not city or not category:
        return jsonify({'message': 'City and category are required parameters'}), 400

    try:
        # Query the ListWorker table with the given city and category
        listworkers = Work.query.filter_by(city=city, category=category).all()

        # Return results as JSON
        return jsonify([{
            'id': listworker.id,
            'title': listworker.title,
            'category': listworker.category,
            'work_description': listworker.work_description,
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


@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    decoded_token, error_response = verify_firebase_token()
    if error_response:
        return jsonify(error_response)

    # email = decoded_token.get('email')  # Extract email from the decoded Firebase token
    try:
        data = request.get_json()

        # Debugging: print the received data to check if workerId exists
        print("Received data:", data)

        event_id = data['eventId']
        aadhaar_number = data['aadhaar_number']  # Make sure workerId is in the payload
        user_id = data['userId']
        user_email = data['email']  # Get email from the request data

        if not aadhaar_number:
            raise ValueError("Worker ID is missing from request")

        # Generate a unique channel for the specific worker
        worker_channel = f'worker-{user_email}-channel'
        print(worker_channel)
        # Send Pusher event to notify the specific worker
        pusher_client.trigger(
            worker_channel,  # Dynamic channel based on worker ID
            'new-appointment',  # Event name
            {
                'eventId': event_id,
                'userId': user_id,
                'userEmail': user_email,  # Send the email along with other data
                'message': 'New appointment request!'
            }
        )

        return jsonify({'success': True, 'message': 'Appointment request sent.'})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/add-work', methods=['POST'])
def add_listworker():
    decoded_token, error_response = verify_firebase_token()
    if error_response:
        return jsonify(error_response)

    email = decoded_token.get('email')
    
    
    data = request.get_json()  # Use get_json() to parse JSON body

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
        category=data.get('category'),
        work_description=data.get('description'),
        price=data.get('priceRange'),
        city=data.get('place'),
        imageurl=data.get('imageurl'),  # If needed, else remove this line
        start_time=start_time,
        end_time=end_time,
        aadhaar_number = data.get("aadhaarNumber")
    )

    db.session.add(new_listworker)
    db.session.commit()

    return jsonify({'message': 'ListWorker added successfully'}), 201


# @app.route('/listworks', methods=['GET'])
# def get_listworkers():
#     # decoded_token, error_response = verify_firebase_token()
#     # if error_response:
#     #     return jsonify(error_response)

#     # email = decoded_token.get('email')
#     city = request.args.get('city')
#     category = request.args.get('category')

#     # Log the incoming query parameters for debugging
#     print(f"Received city: {city}, category: {category}")

#     # Validate input
#     if not city or not category:
#         return jsonify({'message': 'City and category are required parameters'}), 400

#     try:
#         # Query the ListWorker table with the given city and category
#         listworkers = Work.query.filter_by(city=city, category=category).all()

#         # Return results as JSON
#         return jsonify([{
#             'id': listworker.id,
#             'title': listworker.title,
#             'category': listworker.category,
#             'work_description': listworker.work_description,
#             'price': listworker.price,
#             'city': listworker.city,
#             'imageurl': listworker.imageurl,
#             'start_time': listworker.start_time.strftime('%Y-%m-%d %H:%M:%S'),
#             'end_time': listworker.end_time.strftime('%Y-%m-%d %H:%M:%S'),
#             'aadhaar_number' : listworker.aadhaar_number
#         } for listworker in listworkers]), 200

#     except Exception as e:
#         # Log and return a general error message if any issue occurs during the query
#         print(f"Error: {str(e)}")
#         return jsonify({'message': 'An error occurred while processing the request'}), 500


################################################################################################


    
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
    return jsonify({'message': "Login successful", 'email': email})


    # Extract email and password from the request body
    #email = data.get('email')
    #password = data.get('password')


    # Check if the worker exists in the database
    #worker = Login.query.filter_by(email=email).first()
    
    #print("worker", worker)
    # if worker:
    #     if worker.password == password:
    #         return jsonify({'message': 'Login successful'}), 200
    #     else:
    #         return jsonify({'message': 'Invalid email or password'}), 401
    # else:
    #     return jsonify({'message': 'Worker does not exist. Please register.'}), 404

    
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
    existing_worker = User.query.filter_by(email=email).first()
    if existing_worker:
        
        return jsonify({'message': 'Worker already registered'}), 409
    # Create a new worker
    new_worker = User(first_name=first_name, last_name = last_name, email=email, uid = uid)  # Hash the password in a real scenario
    db.session.add(new_worker)
    db.session.commit()
    return jsonify({'message': 'Worker registered successfully'}), 201
        

# @app.route('/listwork', methods=['GET'])
# def get_listworkers():
#     # decoded_token, error_response = verify_firebase_token()
#     # if error_response:
#     #     return jsonify(error_response)

#     # email = decoded_token.get('email')
#     city = request.args.get('city')
#     category = request.args.get('category')
#     # listworkers = Work.query.filter(
#     #     (Work.city == city if city else True),  # Filter by city if it's defined
#     #     Work.title == category  # Always filter by category
#     # ).all()


#     # Log the incoming query parameters for debugging
#     print(f"Received city: {city}, category: {category}")

#     # Validate input
#     if not category:
#         return jsonify({'message': 'Category is required parameters'}), 400

#     try:
#         # Query the ListWorker table with the given city and category
#         listworkers = Work.query.filter(
#             (Work.city == city if city else True),  # Filter by city if it's defined
#             Work.title == category  # Always filter by category
#         ).all()
        
#         print("listworker: ", listworkers)
#         # Return results as JSON
#         return jsonify([{
#             'id': listworker.id,
#             'title': listworker.title,
#             # 'work_description': listworker.description,
#             'price': listworker.price,
#             'city': listworker.city,
#             #'imageurl': listworker.imageurl,
#             'start_time': listworker.start_time.strftime('%Y-%m-%d %H:%M:%S'),
#             'end_time': listworker.end_time.strftime('%Y-%m-%d %H:%M:%S'),
#             #'aadhaar_number' : listworker.aadhaar_number
#         } for listworker in listworkers]), 200

#     except Exception as e:
#         # Log and return a general error message if any issue occurs during the query
#         print(f"Error: {str(e)}")
#         return jsonify({'message': 'An error occurred while processing the request'}), 500

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




# @app.route('/create-order', methods=['POST'])
# def create_order():
#     data = request.get_json()
#     amount = data.get('amount')  # Amount in paise

#     # Create an order using Razorpay API
#     order = razorpay_client.order.create({
#         'amount': amount,
#         'currency': 'INR',
#         'payment_capture': '1',  # Automatic capture
#     })

#     order_id = order['id']

#     # Return the order ID and Razorpay key to the frontend
#     return jsonify({
#         'order_id': order_id,
#         'razorpay_key': 'vAWsD9TOjoc9SAWbVQ3jUJjX'  # Use your Razorpay API key here
#     })
    
# @app.route('/verify-payment', methods=['POST'])
# def verify_payment():
#     data = request.get_json()
#     payment_id = data.get('payment_id')
#     order_id = data.get('order_id')
#     signature = data.get('razorpay_signature')

#     # Verify the payment signature using Razorpay's SDK
#     try:
#         razorpay_client.utility.verify_payment_signature({
#             'razorpay_order_id': order_id,
#             'razorpay_payment_id': payment_id,
#             'razorpay_signature': signature
#         })
#         # Payment is valid
#         return jsonify({'status': 'Payment successful'})
#     except razorpay.errors.SignatureVerificationError:
#         # Invalid payment signature
#         # return jsonify({'status': 'Payment verification failed'}), 400
#         pass
# # ----------------------------- MAIN -----------------------------
#     # email = decoded_token.get('email')  # Extract email from the decoded Firebase token
#     try:
#         data = request.get_json()

#         # Debugging: print the received data to check if workerId exists
#         print("Received data:", data)

#         event_id = data['eventId']
#         aadhaar_number = data['aadhaar_number']  # Make sure workerId is in the payload
#         user_id = data['userId']
#         user_email = data['email']  # Get email from the request data

#         if not aadhaar_number:
#             raise ValueError("Worker ID is missing from request")

#         # Generate a unique channel for the specific worker
#         worker_channel = f'worker-{aadhaar_number}-channel'
#         print(worker_channel)
#         # Send Pusher event to notify the specific worker
#         pusher_client.trigger(
#             worker_channel,  # Dynamic channel based on worker ID
#             'new-appointment',  # Event name
#             {
#                 'eventId': event_id,
#                 'userId': user_id,
#                 'userEmail': user_email,  # Send the email along with other data
#                 'adharNumber': aadhaar_number,
#                 'message': 'New appointment request!'
#             }
#         )

#         return jsonify({'success': True, 'message': 'Appointment request sent.'})

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'success': False, 'message': str(e)}), 500


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



# Endpoint to forward the request to the KYC service and receive the response
@app.route('/verify-kyc', methods=['POST'])
def verify_kyc():
   
    try:
        # Get data from request
        data = request.get_json()
        
        # Prepare data for forwarding to the KYC app
        kyc_data = {
            "front_image_path": data.get('front_image_path'),
            "back_image_path": data.get('back_image_path'),
            "doc_insert_id": data.get('doc_insert_id'),
            "nat_id": data.get('nat_id')
        }

        # Check if required fields are present
        if not kyc_data["front_image_path"] and not kyc_data["back_image_path"]:
            return jsonify({"error": "At least one image (front_image_path or back_image_path) is required"}), 400
        
        if not kyc_data["doc_insert_id"] or not kyc_data["nat_id"]:
            return jsonify({"error": "doc_insert_id and nat_id are required"}), 400
        
        # Send the data to the KYC service (running on 127.0.0.1:5001)
        kyc_service_url = 'http://127.0.0.1:5001/process_documents'
        response = requests.post(kyc_service_url, json=kyc_data)
        
        if response.status_code == 200:
            # Forward the response from the KYC service to the client
            return jsonify(response.json()), 200
        else:
            # Handle any error response from the KYC service
            return jsonify({"error": "Error processing KYC data", "details": response.json()}), response.status_code
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if not already present
    app.run(debug=True)
