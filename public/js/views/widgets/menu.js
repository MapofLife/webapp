/**
 * Species list view for running click radius queries against CartoDB
 */
 
define([
  'jQuery',
  'Underscore',
  'mps',
  'Backbone',
  'models/widget',
  'text!/templates/widgets/menu.html'
], function ($, _, mps, Backbone, Model, template, Results) {
  return Backbone.View.extend({

    tagName: 'div',

    attributes: function () {
      return {
        class: this.model ? 'mol-BottomRightMenu' : ''
      };
    },
    
    /**
     * Initialize by rendering the HTML template.
     *
     * @params Object containing the map view.
     */
    initialize: function (params, parent) {
      this.display = parent;
      this.template = _.template(template);
      this.model = new Model(params);
      this.on('rendered', this.setup, this);
    },

    /**
     * Render the view by adding it to the Control Display.
     */
    render: function () {
      this.setElement(this.make(this.tagName, this.attributes(),
                      this.template()));         
      this.display.add(this.$el, this.model.get('position').y.toUpperCase());
      this.trigger('rendered');
      return this;
    },

    events: {
      'click .dash': 'toggleDash'
    },

    /**
     * 
     */
    setup: function () {
      return this;
    },
    
    /**
     * Toggle view style.
     */
    toggleDash: function (e) {
      //show dashboard
      mps.publish('taxonomy-dashboard-toggle', {source: 'menu'});
    },

  });
});