/*
 * Widget view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'models/boiler',
  'mps'
], function ($, _, Backbone, Models, mps) {
  return Backbone.View.extend({
    
    initialize: function (options) {
      this.parentView = options.parentView;
      if (this.collection)
        this.parentView.model.set({ list: this.collection }, { silent: true });
      this.setElement($('#' + this.id, $('#xf-'
                      + this.parentView.model.get('id'))));
      this.model = new Models.WidgetModel;
      this.on('rendered', this.setup, this);
      this.on('rendered', this.resize, this);
      this.model.on('change', this.render, this);
      $(window).resize(_.throttle(_.bind(this.resize, this), 20));
      mps.subscribe('/logout', _.bind(function (e) {
        this.remove();
      }, this));
    },

    render: function (test) {
      this.$el.html(this.template());
      this.trigger('rendered');
      return this;
    },

    setup: function () {
      return this;
    },

    resize: function (e) {
      return this;
    }

  });
});
