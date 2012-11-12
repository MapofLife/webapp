/*
 * Layer Row view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'views/boiler',
  'text!/templates/rows/layer.html',
  'mps'
], function ($, _, Views, template, mps) {
  return Views.RowView.extend({

    attributes: function () {
      return _.defaults({ class: 'layer-row' },
                        Views.RowView.prototype.attributes.call(this));
    },

    initialize: function (options) {
      this.template = _.template(template);
      Views.RowView.prototype.initialize.call(this, options);
    },

    render: function () {
      Views.RowView.prototype.render.call(this);
      return this;
    },

    events: {
      //
    },

    setup: function () {
      Views.RowView.prototype.setup.call(this);
      return this;
    }

  });
});
