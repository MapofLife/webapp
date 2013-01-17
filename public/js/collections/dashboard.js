/*
 * Dashboard Results collection
 */

define([
  // dependencies
  'Underscore',
  'Backbone',
  'models/dashboard'
], function (_, Backbone, Model) {
  return Backbone.Collection.extend({

    initialize: function () {
        console.log("dashboard collections init");
    },

    process: function () {

    },

    model: Model

  });
});
