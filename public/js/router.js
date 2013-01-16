/*
 * Handle URL paths and changes
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'mapping',
  'Backbone',
  'bus',
  'views/login',
  'views/header',
  'views/map',
  'views/lists/species'
], function ($, _, mapping, Backbone, Bus, Login, Header, Map, SpeciesListModal) {
  var AppRouter = Backbone.Router.extend({
    
    initialize: function () {
      // Clear Facebook shiz:
      if (window.location.hash !== '')
        try {
          window.history.replaceState('', '', window.location.pathname
                                      + window.location.search);
        } catch(err) {}
      // page routes
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
        var speciesListModal = new SpeciesListModal();
        var map = new Map().render();
        CartoDB.sql = {
          autocomplete: "SELECT n,v FROM ac WHERE n~*'\\m{0}' OR v~*'\\m{0}'",
          byName: 'SELECT DISTINCT l.scientificname as name,'+
                    't.type as type,'+
                    't.sort_order as type_sort_order, ' +
                    't.title as type_title, '+
                    't.opacity as opacity, ' +
                    'CONCAT(l.provider,\'\') as source, '+
                    'CONCAT(p.title,\'\') as source_title,'+
                    's.source_type as source_type, ' +
                    's.title as source_type_title, ' +   
                    'l.feature_count as feature_count, '+
                    'CONCAT(n.v,\'\') as names, ' +
                    'CONCAT(\'{' +
                        '"sw":{' +
                            '"lng":\',ST_XMin(l.extent),\', '+
                            '"lat":\',ST_YMin(l.extent),\' '+
                        '}, '+
                        '"ne":{' +
                        '"lng":\',ST_XMax(l.extent),\', ' +
                        '"lat":\',ST_YMax(l.extent),\' ' +
                        '}}\') as extent, ' +
                    'l.dataset_id as dataset_id, ' +
                    'd.dataset_title as dataset_title, ' + 
                    'd.style_table as style_table ' +
                'FROM layer_metadata l ' +
                'LEFT JOIN data_registry d ON ' +
                    'l.dataset_id = d.dataset_id ' +
                'LEFT JOIN types t ON ' +
                    'l.type = t.type ' +
                'LEFT JOIN providers p ON ' +
                    'l.provider = p.provider ' +
                'LEFT JOIN source_types s ON ' +
                    'p.source_type = s.source_type ' +
                'LEFT JOIN ac n ON ' +
                    'l.scientificname = n.n ' +
                'WHERE ' +
                     "n.n~*'\\m{0}' OR n.v~*'\\m{0}' " +
                'ORDER BY name, type_sort_order',
          speciesQuery: "SELECT * FROM " + 
                        "get_species_list('{0}',{1},{2},{3},'{4}')",
          speciesQueryCsv: "SELECT * FROM " +
                           "get_species_list_csv('{0}',{1},{2},{3},'{4}')"
        };
        CartoDB.url = {
          sql: 'http://d3dvrpov25vfw0.cloudfront.net/api/v2/sql?callback=?&q={0}',
          query: 'http://mol.cartodb.com/api/v2/sql?callback=?&q={0}'
        };
      });
      // Bus.init();
    },

    login: function () {
      console.log('Route:', 'login')
      new Login().render();
    },

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
