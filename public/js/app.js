/*
 * Core applicaton
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'router'
], function ($, _, Backbone, Router, mps) {
  var init = function () {
    Router.init();
  }

  return {
    init: init
  };
});
