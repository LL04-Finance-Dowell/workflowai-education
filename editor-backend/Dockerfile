# Use a smaller version of Python with Alpine
FROM python:3.11-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install necessary system dependencies
RUN apk update && \
    apk add --no-cache \
    git \
    g++ \
    build-base \
    libffi-dev \
    openssl-dev \
    musl-dev \
    postgresql-dev

# Copy the requirements file into the container
COPY ./requirements.txt /usr/src/app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Django app code to the container
COPY . /usr/src/app

# Run Django migrations
RUN python3 manage.py makemigrations && \
    python3 manage.py migrate

# Expose the port on which the Django app will run
EXPOSE 8000

# Command to run the Django app
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
