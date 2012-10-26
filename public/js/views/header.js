/*
 * Header view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'mps'
], function ($, _, Backbone, template, mps) {
  return Backbone.View.extend({

    el: '#header',

    initialize: function () {
      this.on('rendered', this.setup, this);
    },

    render: function () {
      this.trigger('rendered');
      return this;
    },

    events: {
      //
    },

    setup: function () {
      return this;
    },

  });
});
