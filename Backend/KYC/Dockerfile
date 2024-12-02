# Start from a base image that includes Python
FROM python:3.10-slim

# Set environment variables for Tesseract
ENV TESSDATA_PREFIX=/usr/share/
ENV LANG=C.UTF-8

# Install system dependencies including Tesseract and its language data
RUN apt-get update && \
    apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Create a working directory for the app
WORKDIR /app

# Copy the requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Ensure the tessdata directory is available and copy it if needed
# (Ensure you have the tessdata folder locally)
# COPY tessdata /usr/share/tesseract-ocr/4.00/tessdata/

# Expose the port that Flask will run on
EXPOSE 5000

# Set the default command to run your Flask application
CMD ["python", "app.py"]
