import logging
import os
import sys

def fix_path():  
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/google'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'mol'))

fix_path()

ON_DEV = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')

engineauth = {
  'login_uri': 'self'
}

engineauth['provider.auth'] = {
  'user_model': 'engineauth.models.User',
  'session_backend': 'datastore'
}

if ON_DEV:
  GITHUB_APP_KEY = '75b4a738835e67f2d275'
  GITHUB_APP_SECRET = 'a6c2d8fb0abf02c852da920883743650a4f2a74e'
else:
  GITHUB_APP_KEY = 'b211a738c977b79b6387'
  GITHUB_APP_SECRET = '172b000e86a545f8706760377c21f9473bac675a'

engineauth['provider.github'] = {
  'client_id': GITHUB_APP_KEY,
  'client_secret': GITHUB_APP_SECRET,
  'scope': ['user', 'repo']
}

if ON_DEV:
  # Facebook settings for Development
  FACEBOOK_APP_KEY = '287936187987314'
  FACEBOOK_APP_SECRET = '5e9cfad1bc39cf390ff6d1b7e63794b2'
else:
  # Facebook settings for Production
  FACEBOOK_APP_KEY = '136655193143004'
  FACEBOOK_APP_SECRET = '47c7aa689de793d20058620bf237d62b'

engineauth['provider.facebook'] = {
  'client_id': FACEBOOK_APP_KEY,
  'client_secret': FACEBOOK_APP_SECRET,
  'scope': ['email',
            'user_about_me',
            'user_birthday',
            'user_website',
            'user_status',
            'user_photos',
            'read_stream',
            'publish_stream']
}

def webapp_add_wsgi_middleware(app):
  from engineauth import middleware
  return middleware.AuthMiddleware(app, engineauth)
