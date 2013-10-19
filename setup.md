#Heroku Environment Setup

1. **Initialize virtual environment:** `virtualenv venv --distribute`

2. **Start virtual environment:** `source venv/bin/activate`

3. **Install dependancies:**

        pip install django
        pip install gunicorn
        pip install dj-database-url
        pip install dj-static
        pip install django-toolbelt

3. **To start django project:** `django-admin.py startproject <PROJECT_NAME> .`

4. **Create a "Procfile" with the following in it:** `web: gunicorn <PROJECT_NAME>.wsgi`

5. **To test run: `foreman start`**

6. **To export dependancies to requirements.txt:** `pip freeze > requirements.txt`

7. **To set up secret keys:**

        heroku config:add DB_PASS=<DB_PASS>
        heroku config:add SALT=<HASH_STRING>

   Then add the same variable assignments to the "activate" file or create a .env file.  
   Alternatively write a config.py and have python handle environment settings.
	
8. **Configure settings.py and wsgi.py:**
    

9. **Create .gitignore file:**

        venv
        .env
        *.pyc
        .DS_Store
        config.py


10. **Initialize Git:**

        git init
        git add .
        git commit -m "initial commit for heroku."
        heroku create

11. **When ready push to Heroku:** `git push heroku master`
