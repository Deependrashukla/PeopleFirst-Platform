import threading
import document_processor
from common_library import *
from flask import Flask, request, jsonify, Response
from flasgger import Swagger, swag_from
import platform
import shutil
import os
import requests
import json
import time

# Dynamically set Tesseract command path based on the OS
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  # Windows path
else:
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"  # Linux path for Docker

app = Flask(__name__)
swagger = Swagger(app)

# Function to download files
def download_file(url, local_path, retries=3, wait=5):
    try:
        for attempt in range(retries):
            response = requests.get(url, stream=True)
            if response.status_code == 200:
                with open(local_path, 'wb') as file:
                    shutil.copyfileobj(response.raw, file)
                return
            elif response.status_code == 429:
                print("Rate limit hit, waiting before retrying...")
                time.sleep(wait)  # Wait before retrying
            else:
                raise Exception(f"Failed to download file: {response.status_code}")
        raise Exception("Max retries reached. Could not download file.")
    except Exception as e:
        raise Exception(f"Error downloading file: {e}")

# Function to process documents in parallel
def process_document_image(image_path, nat_id, folder_path, image_type):
    image_local_path = os.path.join(folder_path, f'{image_type}_image.jpg')
    download_file(image_path, image_local_path)

    # Process the image after downloading
    processor = document_processor.DocumentProcessor(image_local_path, nat_id)
    processed_details = processor.process_document()
    
    return processed_details

# /apidocs
@swag_from({
    'parameters': [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "front_image_path": {"type": "string", "example": "https://example.com/front.jpg"},
                    "back_image_path": {"type": "string", "example": "https://example.com/back.jpg"},
                    "doc_insert_id": {"type": "string", "example": "12345"},
                    "nat_id": {"type": "string", "example": "IND"}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Combined KYC Document Details',
            'schema': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'dob': {'type': 'string'},
                    'id_number': {'type': 'string'},
                    'address': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Invalid input, please provide necessary details'
        },
        500: {
            'description': 'Internal Server Error'
        }
    }
})
@app.route('/process_documents', methods=['POST'])
def process_documents():
    """
    Processes KYC documents to extract details
    --- 
    tags:
      - Document Processing
    summary: Processes front and/or back KYC documents to extract combined information
    """
    try:
        # Get data from request
        data = request.get_json()
        front_image_path = data.get('front_image_path')
        back_image_path = data.get('back_image_path')
        doc_insert_id = data.get('doc_insert_id')
        nat_id = data.get('nat_id')
        
        if not front_image_path and not back_image_path:
            return jsonify({"error": "Invalid input, please provide any one or both images front_image_path, back_image_path"}), 400
        
        if not doc_insert_id or not nat_id:
            return jsonify({"error": "Invalid input, please provide nat_id, and doc_insert_id"}), 400
        
        # Create a folder to save images locally
        folder_path = str(doc_insert_id)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        front_details = {'Name': None, 'DOB': None, 'Id Number': None, 'Address': None}
        back_details = {'Name': None, 'DOB': None, 'Id Number': None, 'Address': None}

        # Use threads to process both front and back images concurrently
        threads = []

        if front_image_path:
            # Start a thread for processing the front image
            front_thread = threading.Thread(target=lambda: process_document_image(front_image_path, nat_id, folder_path, 'front'))
            threads.append(front_thread)
            front_thread.start()

        if back_image_path:
            # Start a thread for processing the back image
            back_thread = threading.Thread(target=lambda: process_document_image(back_image_path, nat_id, folder_path, 'back'))
            threads.append(back_thread)
            back_thread.start()

        # Wait for all threads to finish
        for thread in threads:
            thread.join()

        # Combine the results after all threads are done
        combined_details = {
            "name": front_details.get('Name') or back_details.get('Name'),
            "dob": front_details.get('DOB') or back_details.get('DOB'),
            "id_number": front_details.get('Id Number') or back_details.get('Id Number'),
            "address": front_details.get('Address') or back_details.get('Address')
        }

        # Manually serialize the JSON
        response_json = json.dumps(combined_details)

        # Return the manual JSON response
        return Response(response_json, mimetype='application/json'), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, threaded=True)

