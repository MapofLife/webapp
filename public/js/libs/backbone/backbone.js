define(['libs/backbone/backbone.min'], function () {
  // remove library namespaces from global
  _.noConflict();
  $.noConflict();
  return Backbone.noConflict();
});