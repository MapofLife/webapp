/*
 * Widget model
 */
define([
  // dependencies
  'Underscore',
  'Backbone'
], function (_, Backbone) {
  return Backbone.Model.extend({

    defaults: {
      name: null,
      position: null,
      open: true
    }

  });
});
