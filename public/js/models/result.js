/*
 * Search Result model
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'util'
], function ($, _, Backbone, util) {
  return Backbone.Model.extend({

    defaults: {
      on: true
    },

    initialize: function (params) {
      delete this.collection;
      this.id = util.layerId(params);
    },

  });
});