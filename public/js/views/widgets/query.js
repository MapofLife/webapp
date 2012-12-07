/**
 * Species list view for running click radius queries against CartoDB
 */
 
define([
  'jQuery',
  'Underscore',
  'mps',
  'Backbone',
  'models/widget',
  'text!/templates/widgets/query.html'
], function ($, _, mps, Backbone, Model, template) {
  return Backbone.View.extend({

    tagName: 'div',

    attributes: function () {
      return {
        class: this.model ? 'mol-Map-QueryDisplay widgetTheme' : '',
        title: 'Use this control to select species group and radius. Then right click (Mac Users: "control-click") on focal location on map.'
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
      this.searching = {};
      mps.subscribe('species-list-query-click', _.bind(this.execute, this));
    },

    /**
     * Render the view by adding it to the Control Display.
     *
     */
    render: function () {
      this.setElement(this.make(this.tagName, this.attributes(),
                      this.template()));
      this.display.add(this.$el, this.model.get('position').y.toUpperCase());
      this.trigger('rendered');
      return this;
    },

    events: {
      'click .toggle': 'toggle'
    },

    /**
     * 
     */
    setup: function () {
      return this;
    },

    /**
     * Perform a species list search when a
     * click event was triggered from the map.
     */
    execute: function (params) {
      console.log('MAP CLICK EVENT: ', params.gmaps_event)
      return this;
    },

    /**
     * Toggle view style.
     */
    toggle: function (e) {
      if (this.$el.hasClass('off'))
        this.$el.removeClass('off');
      else
        this.$el.addClass('off');
    },

  });
});