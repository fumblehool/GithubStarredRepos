from flask import Flask
from flask.ext.script import Manager

app = Flask(__name__)
manager = Manager(app)

from app import views
