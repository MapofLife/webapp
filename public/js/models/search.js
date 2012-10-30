/*
 * Search model
 */
define([
  // dependencies
  'Underscore',
  'Backbone'
], function (_, Backbone) {
  return Backbone.Model.extend({

    _path: 'search',
    _type: 'search',

    initialize: function () {
      // NOP
    }
  });
});