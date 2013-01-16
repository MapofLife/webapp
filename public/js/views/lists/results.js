/**
 * Search Results view
 */

define([
  'jQuery',
  'Underscore',
  'mps',
  'views/boiler',
  'models/widget',
  'text!/templates/lists/results.html',
  'collections/results',
  'views/rows/result'
], function ($, _, mps, Views, Model, template, Collection, RowView) {
  return Views.ListView.extend({

    attributes: function () {
      return _.extend({
        class: this.model ? 'mol-LayerControl-' + this.model.get('name') : ''
      }, Views.ListView.prototype.attributes.call(this));
    },
    
    initialize: function (params, parent) {
      this.template = _.template(template);
      this.model = new Model(params);
      this.collection = new Collection();
      this.RowView = RowView;
      mps.subscribe('search-results', _.bind(this.receive, this));
      Views.ListView.prototype.initialize.call(this, params, parent);
    },

    render: function () { 
      return Views.ListView.prototype.render.call(this);
    },

    events: {
      'click .clearResults': 'clear'
    },
    
    setup: function () {
      return Views.ListView.prototype.setup.call(this);
    },

    receive: function (results) {
      this.model.set('term', results.term);
      this.model.set('time', results.response.time);
      this.model.set('total_rows', results.response.total_rows);
      this.collection.reset(results.response.rows);
      this.render();
      this.$el.show();
    },

    clear: function (e) {
      this.$el.hide();
      this.collection.reset();
    }

  });
});
