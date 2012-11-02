/*
 * Layers collection
 */

define([
  // dependencies
  'Underscore',
  'collections/boiler',
  'models/layer'
], function (_, Collections, Model) {
  return Collections.ListCollection.extend({

    model: Model

  });
});
