from marshmallow import Schema, fields, validates, ValidationError

# Worker_login schema
class WorkerLoginSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)

# Worker schema
class WorkerSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    address = fields.Str(required=True)
    pincode = fields.Str(required=True, validate=lambda x: len(x) == 6)
    occupation = fields.Str(required=True)
    aadhaar_number = fields.Str(required=True, validate=lambda x: len(x) == 12)
    experience = fields.Int(required=True)
    mobile = fields.Str(required=True, validate=lambda x: len(x) == 10)
    dob = fields.Date(required=True)
    age = fields.Int(required=True)
    email = fields.Email(required=True)
    aadhaar_card_photo = fields.Str(allow_none=True)
    worker_photo = fields.Str(allow_none=True)

    @validates("experience")
    def validate_experience(self, value):
        if value < 0:
            raise ValidationError("Experience must be a positive number.")

    @validates("age")
    def validate_age(self, value):
        if value <= 0:
            raise ValidationError("Age must be a positive number.")

# ListWorker schema
class ListWorkerSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    category = fields.Str(
        required=True,
        validate=lambda x: x in ['cook', 'plumber', 'maid', 'electrician', 'baby sitting']
    )
    work_description = fields.Str(required=True)
    price = fields.Str(required=True)
    city = fields.Str(required=True)
    imageurl = fields.Str(allow_none=True)
    start_time = fields.DateTime(required=True)
    end_time = fields.DateTime(required=True)

    @validates("start_time")
    def validate_start_time(self, value):
        if value >= self.context.get("end_time", value):
            raise ValidationError("Start time must be before end time.")
