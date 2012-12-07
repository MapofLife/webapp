/*
 * List Row view
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone) {
  return Backbone.View.extend({

    tagName: 'div',

    attributes: function () {
      return {};
    },

    initialize: function (params, parent) {
      this.parent = parent;
      this.on('rendered', this.setup, this);
      this.parent.on('rendered', _.bind(function () {
        this.setElement(this.parent.$('#' + this.model.id));
        this.render();
      }, this));
    },

    events: {
      //
    },

    render: function () {
      this.$el.html(this.template());
      this.trigger('rendered');
      return this;
    },

    setup: function () {
      return this;
    },

    toHTML: function () {
      return this.$el.clone().wrap('<div>').parent().html();
    }

  });
});
