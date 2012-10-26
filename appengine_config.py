import logging
import os
import sys

def fix_path():  
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth/lib/'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth/lib/apiclient'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth/lib/httplib2'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth/lib/oauth2'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth/lib/oauth2client'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/engineauth/lib/uritemplate'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/certifi'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/chardet'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/iso8601'))
  sys.path.append(os.path.join(os.path.dirname(__file__), 'lib/requests'))
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
  GITHUB_APP_KEY = 'e2b1b7d9d7b79af623bf'
  GITHUB_APP_SECRET = '652512f70bc177048c0f55b10e300fc97a8a2011'
else:
  GITHUB_APP_KEY = 'TODO'
  GITHUB_APP_SECRET = 'TODO'

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
