"""This module contains handlers for routing pates."""

import webapp2

from engineauth.models import User
from goog.ndb_json import encode as dumps
from google.appengine.ext import ndb
from webapp2_extras import jinja2

class Jinja2Handler(webapp2.RequestHandler):

    @webapp2.cached_property
    def jinja2(self):
        this = jinja2.get_jinja2(app=self.app)
        return this 

    def get_messages(self, key='_messages'):
        try:
            return self.request.session.data.pop(key)
        except KeyError:
            return None

    def render_template(self, template_name, template_values={}):
        messages = self.get_messages()
        if messages:
            template_values.update({'messages': messages})
        
        self.response.write(self.jinja2.render_template(
            template_name, **template_values))

    def render_string(self, template_string, template_values={}):
        self.response.write(self.jinja2.environment.from_string(
            template_string).render(**template_values))

    def json_response(self, json):
        self.response.headers.add_header('content-type', 'application/json',
                                        charset='utf-8')
        self.response.out.write(json)

class PageHandler(Jinja2Handler):
    def getSession(self):
        return self.request.session if self.request.session else None

    def getUser(self):
        return self.request.user if self.request.user else None

    def getUserProfiles(self, user):
        profile_keys = [ndb.Key('UserProfile', p) for p in user.auth_ids]
        return ndb.get_multi(profile_keys)

    def home(self):
        session = self.getSession()
        user = self.getUser()
        profiles = []
        if user:
            profiles = self.getUserProfiles(user);
        self.render_template('home.html', {
            'title': 'Map of Life',
            'user': user,
            'session': session,
            'profiles': profiles,
            'header': 'default'
        })

    def login(self):
        user = self.getUser()
        if user:
            return self.redirect('/')
        self.render_template('login.html', {
            'title': 'Log in - MOL',
            'header': 'default'
        })

    def logout(self):
        self.response.delete_cookie('_eauth')
        self.redirect('/login')

    def settings(self):
        session = self.getSession()
        user = self.getUser() 
        if not user:
            return self.redirect('/login')
        profiles = self.getUserProfiles(user);
        self.render_template('settings.html', {
            'title': 'Your Profile',
            'user': user,
            'session': session,
            'profiles': profiles,
            'model': dumps(user), # slop!
            'header': 'default'
        })

    def user(self, username):
        session = self.getSession()
        user = self.getUser()
        profiles = []
        if user:
            profiles = self.getUserProfiles(user);
        owner = User.query(User.username==username).fetch()
        if not owner:
            return self.render_template('404.html', {
                'title': 'Map of Life - Not Found',
                'user': user,
                'session': session,
                'profiles': profiles,
                'header': 'default'
            })
        owner = owner[0]
        owner_profiles = self.getUserProfiles(owner);
        self.render_template('user.html', {
            'title': owner.username + ' (' + user.displayName + ')',
            'user': user,
            'session': session,
            'profiles': profiles,
            'owner': owner,
            'owner_profiles': owner_profiles,
            'model': dumps(owner),
            'header': 'user'
        })
