/**
 * The search view for running autocomplete name queries against CartoDB.
 */
define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/search',
  'text!/templates/search.html',
  'mps'
], function ($, _, Backbone, Search, template, mps) {
  return Backbone.View.extend({

    tagName: 'div',

    className: 'widget',
    
    /**
     * Initialize by rendering the HTML template.
     *
     * @params Object containing the Google Maps object.
     */
    initialize: function(params) {
      this.template = _.template(template);  
      this.map = params.map;
      this.on('rendered', this.setup, this);
      this.searching = {};
    },

    /**
     * Render the view by adding it to the Google Map as a Control.
     *
     */
    render: function () {
      this.$el.html(this.template()).appendTo(this.parent);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.el);
      this.trigger('rendered');
      return this;
    },

    events: {
    },

    /**
     * Setup autocomplete on the view input.
     */
    setup: function () {
      var input = this.$('input');
      input.bind('keyup.return', _.bind(function() {
        this.search(input.val());
      }, this));
      input.autocomplete({
        minLength: 3,
        source: _.bind(this.queryAutocomplete, this),
        select: _.bind(function(event, ui) {
          this.searching[ui.item.value] = false;
          this.names = [ui.item.value];
          this.search(ui.item.value);
        }, this),
        close: _.bind(function(event,ui) {
          // NOP
        }, this),
        search: _.bind(function(event, ui) {
          this.searching[input.val()] = true;
          this.names = [];
          mps.publish('show-loading-indicator', {source : "autocomplete"});
        }, this),
        open: _.bind(function(event, ui) {
          this.searching[input.val()] = false;
          mps.publish('hide-loading-indicator', {source : "autocomplete"});
        }, this)
      });
      return this;
    },

    /**
     * Queries CartoDB for autocomplete results matching the request search 
     * term.
     * 
     * @param request The autocomplete request containing the search term.
     * @param response The autocomplete response callback.
     */
    queryAutocomplete: function(request, response) {
      var term = $.trim(request.term).replace(/ /g, ' ');
      var sql = CartoDB.sql.autocomplete.format(term);
      var url = CartoDB.url.sql.format(sql);
      $.getJSON(url, _.bind(this.handleAutocompleteResponse(response), this));
    },

    /**
     * Returns a function for Handling the response from CartoDB. It extracts
     * the English and Scientific names and fires the autocomplete response 
     * callback. It also publishes the hide-loading-indicator topic.
     * 
     * @param response The autocomplete response callback.
     */
    handleAutocompleteResponse: function(response) {
      return function(json) {
        var names = _.map(json.rows, _.bind(this.processRow, this))
        var sciNames = _.reduce(names, this.reduceNames(0), []);
        var engNames = _.reduce(names, this.reduceNames(1), []);        
        if (sciNames.length > 0) {
          this.names = sciNames;
        }
        response(engNames);
        mps.publish('hide-loading-indicator', {source: 'autocomplete'});
      }
    },

    /**
     * Returns a function used to reduce names into English or Scientific.
     */
    reduceNames: function(index) {
      return function(memo, x) {
        memo.push(x[index]);
        return memo;
      };
    },

    /**
     * Processes the supplied CartoDB row by returning a 2-dimentional names
     * array [Scientific, English].
     *
     * @param row The CartoDB row.
     */
    processRow: function(row) {
      var engName = '';
      var sciName = '';
      var label = '<div class="ac-item">' +
                    '<span class="sci">{0}</span>' +
                    '<span class="eng">{1}</span>' +
                  '</div>';
      if (row.n === undefined) {
        return [];
      }
      sciName = row.n;
      if (row.v) {
        engName = ', {0}'.format(engName.replace(/'S/g, "'s"));        
      }
      return [sciName, {label: label.format(sciName, engName), value: sciName}];
    },

    /**
     * Search CartoDB on the supplied term.
     */
    search: function(term) {
      var sql = null;
      var url = null;
      var source = null;
      this.$('input').autocomplete('disable');
      term = $.trim(term);
      if (term.length === 0) {
        mps.publish('clear-results', {});
        this.$('input').autocomplete('enable');
      } else if (term.length < 3) {
        alert('Search term must have at least 3 characters.');
        this.$('input').autocomplete('enable');
      } else {
        this.$('input').val(term);
        source = {source : "search-{0}".format(term)};
        mps.publish('show-loading-indicator', source);                  
        term = term.replace(/ /g, ' ');
        sql = CartoDB.sql.byName.format(term);
        url = CartoDB.url.sql.format(sql);
        $.getJSON(url, _.bind(this.handleSearchResponse(term, source), this));
      }
    },

    /**
     * Return a function for handling a CartoDB search response.
     */
    handleSearchResponse: function(term, source) {
      return function(response) {
        var results = {term:term, response:response};
        mps.publish('hide-loading-indicator', source);
        mps.publish('search-results', results);
        this.$('input').autocomplete('enable');
        console.log(results);
      };
    }
  });
});