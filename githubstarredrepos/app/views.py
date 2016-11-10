from flask import render_template, request, redirect, session, url_for, flash
from flask.ext.github import GitHub
from app import app
from dbconnect import connection


github = GitHub(app)


@app.route("/")
def main():
    if "token" in session:
        return "Congratulations"
    else:
        return render_template("index.html", token = session['token'])


@app.route('/login')
def login():
    return github.authorize()


@app.route('/github-callback')
@github.authorized_handler
def authorized(oauth_token):
    next_url = request.args.get('next') or url_for('main')
    if oauth_token is None:
        flash("Authorization failed.")
        return redirect(url_for('main'))

    github_access_token = oauth_token
    session['token'] = github_access_token
    return redirect(next_url)


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.errorhandler(500)
def inter_error(e):
    return render_template("500.html"), 500
