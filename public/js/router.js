/*
 * Handle URL paths and changes
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'bus',
  'views/login',
  'views/header',
  'views/map',
  'views/search',
  'mapping'
], function ($, _, Backbone, Bus, Login, Header, Map, Search, mapping) {
  var AppRouter = Backbone.Router.extend({
    
    initialize: function () {
      // Clear Facebook shiz:
      if (window.location.hash !== '')
        try {
          window.history.replaceState('', '', window.location.pathname
                                      + window.location.search);
        } catch(err) {}
      // page routes
      // this.route(':username/:name', 'idea', _.bind(this.idea, this));
      // this.route(':username', 'profile', _.bind(this.profile, this));
      // this.route(/^settings\/profile$/, 'settings', _.bind(this.settings, this));
      this.route('login', 'login', _.bind(this.login, this));
      this.route('', 'home', _.bind(this.home, this));
    },

    routes: {
      // catch all
      '*actions': 'default'
    },

    home: function () {
      console.log('Route:', 'home')
      mapping.init(function() {
        var header = new Header().render();
        var map = new Map().render();  
        var search = new Search({map: map.map}).render();        
        CartoDB.sql = {
          autocomplete: "SELECT n,v FROM ac WHERE n~*'\\m{0}' OR v~*'\\m{0}'"
        };
        CartoDB.url = {
          sql: 'http://d3dvrpov25vfw0.cloudfront.net/api/v2/sql?callback=?&q={0}'
        };
      });
      // Bus.init();
    },

    // signup: function () {
    //   console.log('Route:', 'signup')
    //   new Header().render();
    //   new SignUp().render();
    // },

    login: function () {
      console.log('Route:', 'login')
      new Login().render();
    },

    // settings: function () {
    //   console.log('Route:', 'settings')
    //   new Header().render();
    //   new Settings.ProfileSettings().render();
    // },
    
    // profile: function () {
    //   console.log('Route:', 'profile')
    //   new Header().render();
    //   new Profile().render();
    //   Bus.init();
    // },

    default: function (actions) {
      console.warn('No route:', actions);
    }
  
  });
  
  return {
    init: function () {
      var app_router = new AppRouter;
      Backbone.history.start({ pushState: true });
    }
  };

});
