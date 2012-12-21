/*
 * Species List Results collection
 */

define([
  // dependencies
  'Underscore',
  'Backbone',
  'models/species'
], function (_, Backbone, Model) {
  return Backbone.Collection.extend({

    model: Model

  });
});
