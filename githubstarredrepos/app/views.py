from flask import render_template, request, redirect, session
from flask.ext.github import Github
from app import app


@app.route("/")
def main():
    return render_template("index.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.errorhandler(500)
def inter_error(e):
    return render_template("500.html"), 500
