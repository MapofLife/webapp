/*
 * Control Display view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'models/widget',
  'text!/templates/control_display.html',
  'views/widgets'
], function ($, _, Backbone, Model, template, Widgets) {
  return Backbone.View.extend({

    tagName: 'div',

    attributes: function () {
      return {
        class: this.model ? 'mol-Map-' + this.model.get('name') : ''
      };
    },

    initialize: function (params, parent) {
      this.map = parent;
      this.template = _.template(template);

      params.name = _.capitalize(params.position[0]) +
                    _.capitalize(params.position[1]) + 'Control';            
      
      this.model = new Model(params);
      this.on('rendered', this.setup, this);
    },

    render: function () {
      this.setElement(this.make(this.tagName, this.attributes(), this.template()));
      var pos = this.model.get('position');
      var str = (pos[0] + '_' + pos[1]).toUpperCase(); 
      this.map.map.controls[google.maps.ControlPosition[str]].clear();
      this.map.map.controls[google.maps.ControlPosition[str]].push(this.el);
      _.each(this.model.get('widgets'), _.bind(function (widget) {
        new Widgets[widget.name](widget, this).render();
      }, this));
      this.trigger('rendered');
      return this;
    },

    setup: function () {
      this.$(Widgets.Position.TOP,
              Widgets.Position.MIDDLE,
              Widgets.Position.BOTTOM).removeClass('ui-selectee');
      return this;
    },

    add: function(widget, position) {
      widget.appendTo(this.$el.find(Widgets.Position[position]));
      return this;
    }

  });
});
