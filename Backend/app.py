from flask import Flask, request, jsonify
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db
from routes import initialize_routes

import firebase_admin
from firebase_admin import credentials, storage
import pusher
from firebase import verify_firebase_token

# Initialize Firebase
cred = credentials.Certificate(r"C:\Users\LENOVO\Downloads\peoplefirst-caba5-firebase-adminsdk-yhvto-516641ae4b.json")  # Replace with the path to your JSON key
firebase_admin.initialize_app(cred, {
    'storageBucket': 'peoplefirst-caba5.appspot.com'  # Replace with your Firebase bucket
})

app = Flask(__name__)
CORS(app)
# Configure MySQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://helpernest_user:AZt1yiyILymT3QWR6E7ULQ8IXsGWAu7U@dpg-csmvvmij1k6c73dpeh9g-a.oregon-postgres.render.com/helpernest'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


pusher_client = pusher.Pusher(
    app_id='1902004',
    key='be108580dd11495c66aa',
    secret='be987806344c4329b0bc',
    cluster='ap2',
    ssl=True
)

db = SQLAlchemy(app)

# Define a model for Workers (assuming you have a workers table)
class Worker_login(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    # password = db.Column(db.String(80), nullable=False)
    
    
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
    
    completed_works = db.relationship('Work', foreign_keys='Work.worker_id', lazy='dynamic', backref='completed_by')
    in_progress_works = db.relationship('Work', foreign_keys='Work.worker_id', lazy='dynamic', backref='in_progress_by')
    awaiting_works = db.relationship('Work', foreign_keys='Work.worker_id', lazy='dynamic', backref='awaiting_by')

    def __repr__(self):
        return f'<Worker {self.first_name} {self.last_name}>'

# Define a model for Work table
class Work(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # status can be 'completed', 'in-progress', or 'awaiting'
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'), nullable=False)

    def __repr__(self):
        return f'<Work {self.title}>'

# Endpoint to get worker's works based on their status
@app.route('/worker-works/<int:worker_id>', methods=['GET'])
def get_worker_works(worker_id):
    worker = Worker.query.get(worker_id)
    if not worker:
        return jsonify({'message': 'Worker not found'}), 404
    
    completed_works = [{
        'id': work.id,
        'title': work.title,
        'description': work.description,
        'price': work.price,
        'city': work.city,
        'start_time': work.start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'end_time': work.end_time.strftime('%Y-%m-%d %H:%M:%S'),
        'status': work.status
    } for work in worker.completed_works]

    in_progress_works = [{
        'id': work.id,
        'title': work.title,
        'description': work.description,
        'price': work.price,
        'city': work.city,
        'start_time': work.start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'end_time': work.end_time.strftime('%Y-%m-%d %H:%M:%S'),
        'status': work.status
    } for work in worker.in_progress_works]

    awaiting_works = [{
        'id': work.id,
        'title': work.title,
        'description': work.description,
        'price': work.price,
        'city': work.city,
        'start_time': work.start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'end_time': work.end_time.strftime('%Y-%m-%d %H:%M:%S'),
        'status': work.status
    } for work in worker.awaiting_works]

    return jsonify({
        'completed': completed_works,
        'in_progress': in_progress_works,
        'awaiting': awaiting_works
    })


# Endpoint to add a new work
@app.route('/add-work', methods=['POST'])
def add_work():
    data = request.get_json()

    # Extract and validate data
    worker_id = data.get('worker_id')
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    city = data.get('city')
    status = data.get('status')  # This should be 'completed', 'in-progress', or 'awaiting'
    start_time = datetime.strptime(data.get('start_time'), '%Y-%m-%dT%H:%M')
    end_time = datetime.strptime(data.get('end_time'), '%Y-%m-%dT%H:%M')

    worker = Worker.query.get(worker_id)
    if not worker:
        return jsonify({'message': 'Worker not found'}), 404

    # Create new work entry
    new_work = Work(
        title=title,
        description=description,
        price=price,
        city=city,
        status=status,
        start_time=start_time,
        end_time=end_time,
        worker_id=worker_id
    )

    db.session.add(new_work)
    db.session.commit()

    return jsonify({'message': 'Work added successfully'}), 201


########################################### List Worker Table #########################################

class list_worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(
        db.String(100),
        nullable=False,
        default="maid",
    )
    work_description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(50), nullable=False)  # Assuming varchar equivalent
    city = db.Column(db.String(100), nullable=False)
    imageurl = db.Column(db.String(255), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    aadhaar_number = db.Column(db.String(12), nullable=False)

    __table_args__ = (
        db.CheckConstraint(
            "category IN ('cook', 'plumber', 'maid', 'electrician', 'baby sitting')",
            name="valid_category"
        ),
    )

    def __repr__(self):
        return f'<ListWorker {self.title}>'

# Adding a sample route for creating a ListWorker entry
@app.route('/add-listworker', methods=['POST'])
def add_listworker():
    decoded_token, error_response = verify_firebase_token()
    if error_response:
        return jsonify(error_response)

    #email = decoded_token.get('email')
    
    
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
    new_listworker = list_worker(
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


@app.route('/listworkers', methods=['GET'])
def get_listworkers():
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
        listworkers = list_worker.query.filter_by(city=city, category=category).all()

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


################################################################################################


    
# @app.route('/', methods=['GET'])
# def log():
#     return {'result'}

# Route to handle login
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()

#     # Extract email and password from the request body
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({'message': 'Email and password are required'}), 400

#     # Check if the worker exists in the database
#     worker = Worker_login.query.filter_by(email=email).first()
    
#     print("worker", worker)
#     if worker:
#         if worker.password == password:
#             return jsonify({'message': 'Login successful'}), 200
#         else:
#             return jsonify({'message': 'Invalid email or password'}), 401
#     else:
#         return jsonify({'message': 'Worker does not exist. Please register.'}), 404

    
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    email = data.get('email')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    
    # if not email or not password:
    #     return jsonify({'message': 'Email and password are required'}), 400

    # Check if the worker already exists
    existing_worker = Worker_login.query.filter_by(email=email).first()
    if existing_worker:
        
        return jsonify({'message': 'Worker already registered'}), 409
    # Create a new worker
    new_worker = Worker_login(first_name=first_name, last_name = last_name, email=email)  # Hash the password in a real scenario
    db.session.add(new_worker)
    db.session.commit()
    return jsonify({'message': 'Worker registered successfully'}), 201

@app.route('/register-worker', methods=['POST'])
def register_worker():
    data = request.json
    print(data)
    # Ensure that aadhaar_card_photo and worker_photo are strings, not dictionaries
    aadhaar_card_photo = data.get('aadhaarCardPhoto')
    worker_photo = data.get('workerPhoto')

    # If the photo fields are dictionaries (e.g., empty dict), convert them to strings or None
    if isinstance(aadhaar_card_photo, dict):
        aadhaar_card_photo = None  # or set a default value
    if isinstance(worker_photo, dict):
        worker_photo = None  # or set a default value

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
        aadhaar_card_photo=aadhaar_card_photo,
        worker_photo=worker_photo
    )

    # Add the new worker to the session and commit to the database
    db.session.add(new_worker)
    db.session.commit()

    return jsonify({'message': 'Worker registered successfully'}), 201


# Route to get all workers
@app.route('/workers', methods=['GET'])
def get_workers():
    decoded_token, error_response = verify_firebase_token()
    if error_response:
        return jsonify(error_response)

    email = decoded_token.get('email')
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

@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    decoded_token, error_response = verify_firebase_token()
    if error_response:
        return jsonify(error_response)

    email = decoded_token.get('email')
    try:
        data = request.get_json()

        # Debugging: print the received data to check if workerId exists
        print("Received data:", data)

        event_id = data['eventId']
        aadhaar_number = data['aadhaar_number']  # Make sure workerId is in the payload
        user_id = data['userId']

        if not aadhaar_number:
            raise ValueError("Worker ID is missing from request")

        # Generate a unique channel for the specific worker
        worker_channel = f'worker-{aadhaar_number}-channel'

        # Send Pusher event to notify the specific worker
        pusher_client.trigger(
            worker_channel,  # Dynamic channel based on worker ID
            'new-appointment',  # Event name
            {
                'eventId': event_id, 
                'userId': user_id, 
                'message': 'New appointment request!'
            }
        )

        return jsonify({'success': True, 'message': 'Appointment request sent.'})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all tables
    app.run(debug=True)

