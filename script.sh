python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework
pip install django-cors-headers
pip install daphne
pip install channels

python manage.py runserver