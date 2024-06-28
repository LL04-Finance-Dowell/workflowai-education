#!/bin/bash

echo "Apply database migrations"
python manage.py makemigrations
python manage.py migrate

# Execute the provided command or entrypoint
exec "$@"