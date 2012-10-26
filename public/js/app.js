/*
 * Core applicaton
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'router'
], function ($, _, Backbone, Router, mps, cartodb) {
  var init = function () {
    Router.init();
  }

  return {
    init: init
  };
});
