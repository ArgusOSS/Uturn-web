FROM python:3.7-slim-buster
COPY . /opt/uturn/backend
WORKDIR /opt/uturn/backend/
RUN pip install -r requirements.txt --no-cache-dir
WORKDIR /opt/uturn/backend/Uturn/
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate
EXPOSE 8000
CMD ["gunicorn", "Uturn.wsgi", "--bind", "0.0.0.0:8000"]


