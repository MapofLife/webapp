import os
import webapp2

from google.appengine.ext.webapp.util import run_wsgi_app
from webapp2_extras.routes import RedirectRoute

routes = [

    webapp2.Route(r'/',
        handler='handlers.PageHandler:home',
        name='app-splash'),

    RedirectRoute(r'/signup',
        handler='handlers.PageHandler:signup',
        name='app-signup', strict_slash=True),

    RedirectRoute(r'/login',
        handler='handlers.PageHandler:login',
        name='app-login', strict_slash=True),

    RedirectRoute(r'/logout',
        handler='handlers.PageHandler:logout',
        name='app-logout', strict_slash=True),

    RedirectRoute(r'/settings/user',
        handler='handlers.PageHandler:settings',
        name='user-settings', strict_slash=True),

    RedirectRoute(r'/<username:[\w-]+>',
        handler='handlers.PageHandler:user',
        name='user-dashboard', strict_slash=True),
]

DEBUG = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')

config = { 
    'webapp2_extras.sessions': {
        'secret_key': 'wIDjEesObzp5nonpRHDzSp40aba7STuqC6ZRY'
    },
    'webapp2_extras.auth': {
        'user_attributes': ['username', 'email', 'displayName']
    }
}

boom = webapp2.WSGIApplication(routes, debug=DEBUG, config=config)
         
def main():
    run_wsgi_app(boom)
    
if __name__ == "__main__":
    main()