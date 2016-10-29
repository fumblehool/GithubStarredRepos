from flask import Flask
from flask.ext.github import Github

app = Flask(__name__)
app.config.from_object('config')

from app import views
