# use smaller version of alpine
FROM python:3.11-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# install git
RUN apk update \
    && apk add git


# Copy the requirements file into the container
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt --no-cache-dir

# Copy the rest of the Django app code to the container
COPY . /usr/src/app

RUN python3 manage.py makemigrations \
&& python3 manage.py migrate

# Expose the port on which the Django app will run
EXPOSE 8000