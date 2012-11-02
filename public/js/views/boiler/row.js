/*
 * List Row view
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'bus',
  'mps',
  'util'
], function ($, _, Backbone, Bus, mps, util) {
  return Backbone.View.extend({

    tagName: 'div',

    initialize: function (options) {
      this.parentView = options.parentView;
      this.on('rendered', this.setup, this);
      this.parentView.on('rendered', _.bind(function () {
        this.setElement(this.parentView.$('#' + this.model._type
                        + '_' + this.model.id));
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
