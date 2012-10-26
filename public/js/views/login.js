/*
 * Login view
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'mps'
], function ($, _, Backbone, mps) {
  return Backbone.View.extend({
    
    selector: 'div.login',
    
    initialize: function () {
      this.on('rendered', this.setup, this);
    },

    render: function () {
      this.setElement($(this.selector));
      this.trigger('rendered');
      return this;
    },

    events: {
      //
    },

    setup: function () {
      this.$('input[name="username"]').focus();
      return this;
    }

  });
});
