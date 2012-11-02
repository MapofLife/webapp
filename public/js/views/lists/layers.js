/*
 * Layers List view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'mps',
  'views/boiler',
  'text!/templates/lists/layers.html',
  'collections/layers',
  'views/rows/layer'
], function ($, _, mps, Views, template, Collection, RowView) {
  return Views.ListView.extend({
    
    el: '#layers',

    initialize: function (options) {
      this.template = _.template(template);
      this.collection = new Collection;
      this.RowView = RowView;
      Views.ListView.prototype.initialize.call(this, options);
    }

  });
});
