from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
    aadhaar_card_photo = db.Column(db.String(255), nullable=True)
    worker_photo = db.Column(db.String(255), nullable=True)

class ListWorker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(
        db.String(100),
        nullable=False,
        default="maid",
    )
    work_description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    imageurl = db.Column(db.String(255), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    __table_args__ = (
        db.CheckConstraint(
            "category IN ('cook', 'plumber', 'maid', 'electrician', 'baby sitting')",
            name="valid_category"
        ),
    )
