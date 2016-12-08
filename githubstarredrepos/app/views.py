from flask import render_template, request, redirect, session, url_for, flash, Response
from flask.ext.github import GitHub
import requests
import json
import os
from app import app
# from dbconnect import connection
from config import secrets, secret_key


app.config['GITHUB_CLIENT_ID'] = secrets['GITHUB_CLIENT_ID']
app.config['GITHUB_CLIENT_SECRET'] = secrets['GITHUB_CLIENT_SECRET']
app.secret_key = secret_key
github = GitHub(app)


@app.route("/")
def main():
    if "access_token" in session:
        return render_template("user.html", token=session['access_token'])
    else:
        return render_template("index.html")


@app.route('/login')
def login():
    return github.authorize(scope="user,repo")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route('/github-callback')
@github.authorized_handler
def authorized(oauth_token):
    next_url = request.args.get('next') or url_for('main')
    if oauth_token is None:
        flash("Authorization failed.")
        return redirect(url_for('main'))

    github_access_token = oauth_token
    session['access_token'] = github_access_token
    return redirect(next_url)


@app.route('/api/starred')
def starred_repos_handler(c=None):
    access_token = session['access_token']
    url = "https://api.github.com/user/starred?access_token="
    post_url = url + access_token

    r = requests.get(post_url)
    data = r.json()
    lock = False

    with open('data.json', 'r') as f:
        if f.read() == r.text:
            lock = True

    if lock:
        return Response(
        json.dumps([{
    "id": 67319532,
    "name": "algorithms",
    "full_name": "domfarolino/algorithms",
    "owner": {
      "login": "domfarolino",
      "id": 9669289,
      "avatar_url": "https://avatars.githubusercontent.com/u/9669289?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/domfarolino",
      "html_url": "https://github.com/domfarolino",
      "followers_url": "https://api.github.com/users/domfarolino/followers",
      "following_url": "https://api.github.com/users/domfarolino/following{/other_user}",
      "gists_url": "https://api.github.com/users/domfarolino/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/domfarolino/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/domfarolino/subscriptions",
      "organizations_url": "https://api.github.com/users/domfarolino/orgs",
      "repos_url": "https://api.github.com/users/domfarolino/repos",
      "events_url": "https://api.github.com/users/domfarolino/events{/privacy}",
      "received_events_url": "https://api.github.com/users/domfarolino/received_events",
      "type": "User",
      "site_admin": false
    }}]),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

    with open('data.json', 'w') as f:
        json.dump(r.text, f)

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.errorhandler(500)
def inter_error(e):
    return render_template("500.html"), 500
