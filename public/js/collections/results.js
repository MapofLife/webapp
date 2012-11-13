/*
 * Search Results collection
 */

define([
  // dependencies
  'Underscore',
  'Backbone',
  'models/result'
], function (_, Backbone, Model) {
  return Backbone.Collection.extend({

    model: Model

  });
});
