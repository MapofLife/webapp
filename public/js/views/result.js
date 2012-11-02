/**
 * The search result view
 */
define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/result',
  'views/lists/layers',
  'mps'
], function ($, _, Backbone, model, Layers, mps) {
  return Backbone.View.extend({

    tagName: 'div',

    className: 'result',
    
    initialize: function(params) {
      this.model = new model(params.data);
      this.on('rendered', this.setup, this);
    },

    render: function () {
      this.$el.appendTo(this.parent);
      this.layers = new Layers({ parentView: this }).render();
      this.trigger('rendered');
      return this;
    },

    events: {
      //
    },

    setup: function () {
      return this;
    }

  });
});