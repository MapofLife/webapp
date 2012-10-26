"""
    engineauth.strategies.password
    ============================

    OAuth2 Authentication Strategy
    :copyright: (c) 2011 Kyle Finley.
    :license: Apache Sotware License, see LICENSE for details.

    :copyright: (c) 2010 Google Inc.
    :license: Apache Software License, see LICENSE for details.
"""
from __future__ import absolute_import
from engineauth import models
from engineauth.strategies.base import BaseStrategy
from webapp2_extras import security
import logging


__author__ = 'kyle.finley@gmail.com (Kyle Finley)'


class PasswordStrategy(BaseStrategy):

    def user_info(self, req):
        username = req.POST['username']
        email = req.POST.get('email', None)
        user_info = req.POST.get('user_info', {})
        user_info['emails'] = [{'value': email, 'type': 'home', 'primary': True}]
        user_info['username'] = username
        # auth_id = models.User.generate_auth_id(req.provider, email)
        auth_id = models.User.generate_auth_id(req.provider, username)
        return {
            'auth_id': auth_id,
            'info': {
                'emails': [
                    {
                        'value': email, # email
                        'type': None, # home, work
                        'primary': True # boolean
                    },
                ],
                'username': username
            },
            'extra': {
                'raw_info': user_info,
            }
        }

    def get_or_create_profile(self, req, auth_id, user_info, **kwargs):
        """
        Overrides to provide logic for checking and encrypting  passwords.
        :param auth_id:
        :param user_info:
        :param kwargs:
        :return:
        :raise:
        """
        password = kwargs.pop('password')
        profile = models.UserProfile.get_by_id(auth_id)
        if profile is None:
            if req.POST['action'] == 'signup':
                # Create profile
                profile = models.UserProfile.get_or_create(auth_id, user_info,
                    password=security.generate_password_hash(password, length=12))
        else:
            return self.raise_error('i cannot find.')
        # Check password
        if not security.check_password_hash(password, profile.password):
            return self.raise_error('The password that you\'ve provided '
                                    'doesn\'t match our records. '
                                    'Please try again.')
        return profile

    def handle_request(self, req):
        # confirm that required fields are provided.
        username = req.POST['username']
        email = req.POST.get('email', None)
        password = req.POST['password']
        password_confirm = req.POST.get('password_confirm', None)
        action = req.POST['action']

        if action == 'signup':
            if not username or not email or not password or not password_confirm:
                return self.raise_error('All fields are required.')
            if password != password_confirm:
                return self.raise_error('Passwords do not match.')
        else:
            if not username or not password:
                return self.raise_error('All fields are required.')
            
        user_info = self.user_info(req)
        profile = self.get_or_create_profile(req,
            auth_id=user_info['auth_id'],
            user_info=user_info,
            password=password)
        req.load_user_by_profile(profile)

        return req.get_redirect_uri()
