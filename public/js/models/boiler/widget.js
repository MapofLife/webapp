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
      open: true,
      width: 0,
      height: 0
    }

  });
});
