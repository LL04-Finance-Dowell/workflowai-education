# Builder stage
FROM python:3.11.4-slim-buster AS builder

# install postgres dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc
    
# create and use a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# install dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip &&  pip install gunicorn && pip install -r requirements.txt


# Operational Stage
FROM python:3.11.4-slim-buster

RUN apt-get update && \
    apt-get install -y libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Get the virtual environment from the build stage
COPY --from=builder /opt/venv /opt/venv

# set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# set work directory
WORKDIR /usr/src/app

# copy project
COPY . .

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# Define the command to run the Django app using Gunicorn in production mode
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wf_ai_core.wsgi:application", "--log-level", "debug"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]