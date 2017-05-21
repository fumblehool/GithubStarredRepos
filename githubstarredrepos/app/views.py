from flask import render_template, request, redirect, session, url_for,\
    flash, Response
from flask.ext.github import GitHub
import requests
import json
# import os
from app import app
from dbconnect import connection
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
    return github.authorize(scope="user")


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
    session['load_data'] = False
    return redirect(next_url)


@app.route('/api/starred', methods=['GET', 'POST'])
@app.route('/api/starred/<owner>/<name>', methods=['DELETE'])
def starred_repos_handler(owner=None, name=None):

    if request.method == 'DELETE':
        url = "https://api.github.com/user/starred/" + owner + "/" + name
        unstar_repo_url = url + "?access_token=" + session['access_token']

        r = requests.delete(unstar_repo_url)
        session['load_data'] = False

    access_token = session['access_token']
    url = "https://api.github.com/user/starred?access_token="
    post_url = url + access_token
    r = requests.get(post_url)
    data = r.json()
    c, conn = connection()
    count = 0
    for i in data:
        query = "SELECT comment from data WHERE repoid='" + \
                str(data[count]['id']) + "'"
        c.execute(query)
        rv = c.fetchone()
        # from IPython import embed;embed()
        data[count]['comment'] = str(rv)[2:-3]
        count = count + 1
        conn.commit()
    c.close()
    conn.close()
    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/api/user')
def get_user_info():
    access_token = session['access_token']
    url = "https://api.github.com/user?access_token="
    post_url = url + access_token
    r = requests.get(post_url)
    data = r.json()
    session['username'] = data['login']
    session['userid'] = data['id']
    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/api/<repoid>/comment/', methods=['GET', 'POST'])
def post_repo_comment(repoid):
    if request.method == "POST":
        comment = request.json['comment']
        c, conn = connection()
        query = "UPDATE data SET comment ='"\
                + comment + "' WHERE repoid=" + repoid + " AND userid="\
                + str(session['userid'])
        c.execute(query)
        conn.commit()
        c.close()
        conn.close()
    return "done", 200


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.errorhandler(500)
def inter_error(e):
    return render_template("500.html"), 500
