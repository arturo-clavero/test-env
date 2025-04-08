python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers daphne channels numpy channels_redis 
cd transcendence
python3 manage.py runserver 8003