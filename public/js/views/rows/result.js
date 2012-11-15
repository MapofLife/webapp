/*
 * Search Result view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'views/boiler',
  'text!/templates/rows/result.html',
  'mps'
], function ($, _, Views, template, mps) {
  return Views.RowView.extend({

    attributes: function () {
      return _.extend({
        class: this.model ? 'resultContainer'
            + ' name-' + this.model.get('name').replace(/ /g, '_') 
            + ' source_type-' + this.model.get('source_type')
            + ' type-' + this.model.get('type')
            : '',
        id: this.model.id
      }, Views.ListView.prototype.attributes.call(this));
    },

    initialize: function (params, parent) {
      this.template = _.template(template);
      Views.RowView.prototype.initialize.call(this, params, parent);
    },

    render: function () {
      Views.RowView.prototype.render.call(this);
      return this;
    },

    events: {
      'click .source': 'showSource',
      'click .type': 'showType',
      'click .buttonContainer': 'selected'
    },

    setup: function () {
      Views.RowView.prototype.setup.call(this);
      return this;
    },

    // TODO: This gets called multiple times when clicking source.
    showSource: function(e) {
      console.log('TODO: Show source.');
    },

  // TODO: This gets called multiple times when clicking type.
    showType: function(e) {
      console.log('TODO: Show type.');
    },

  // TODO: This gets called multiple times when clicking checkbox.
    selected: function(e) {
      console.log('Layer', this.model.id, 'was selected.');
    }

  });
});
