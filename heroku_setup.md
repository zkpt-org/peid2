virtualenv venv --distribute
source venv/bin/activate

pip install django
pip install gunicorn
pip install dj-database-url
pip install dj-static
pip install django-toolbelt

To start django project:
django-admin.py startproject <projectname> .

Set up "Procfile" with:
web: gunicorn <projectname>.wsgi

to test run: 
foreman start 

To export dependancies to requirements.txt:
pip freeze > requirements.txt

To set up secret passwords:
heroku config:add <SECRET>=<my-secret>