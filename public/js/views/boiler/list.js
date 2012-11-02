/*
 * List view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone) {
  return Backbone.View.extend({
    
    initialize: function (options) {
      this.parentView = options.parentView;
      this.on('rendered', this.setup, this);
      this.views = [];
      this.render({ loading: true })
      // this.collection.on('fetched', this.render, this);
      // this.collection.fetch();
    },

    render: function (options) {
      this.$el.html(this.template(options));
      if (!this.$el.closest('html').length) {
        this.$el.remove();
        this.$el.appendTo(this.parentView.$el);
      }
      this.trigger('rendered');
      return this;
    },

    setup: function () {
      return this;
    },

    row: function (model) {
      var view = new this.RowView({
        parentView: this,
        model: model
      });
      this.views.push(view);
      return view.toHTML();
    },

    unselect: function () {
      this.$('.selected').removeClass('selected');
    }

  });
});
