/*
 * Map view
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'text!/templates/map.html',
  'libs/google/maps/load',
], function ($, _, Backbone, template, loadMaps) {
  return Backbone.View.extend({

    el: '#map',
    options: null,
    map: null,

    initialize: function (options) {
      this.template = _.template(template);
      Backbone.View.prototype.initialize.call(this, options);
      loadMaps({
        key: 'AIzaSyDJdVhfQhecwp0ngAGzN9zwqak8FaEkSTA',
        geometry: false,
      }).done(_.bind(function () {
        this.options = {
          zoom: 3,
          center: new google.maps.LatLng(37.3689, -122.0353),
          maxZoom: 10,
          minZoom: 2,
          minLat: -85,
          maxLat: 85,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "administrative",
              stylers: [
                { visibility: "on" }
              ]
            },
            {
              featureType: "administrative.locality",
              stylers: [
                { visibility: "off" }
              ]
            },
            {
              featureType: "landscape",
              stylers: [
                { visibility: "off" }
              ]
            },
            {
              featureType: "road",
              stylers: [
                { visibility: "off" }
              ]
            },
            {
              featureType: "poi",
              stylers: [
                { visibility: "off" }
              ]
            },{
              featureType: "water",
              stylers: [
                { visibility: "on" },
                { saturation: -65 },
                { lightness: -15 },
                { gamma: 0.83 }
              ]
            },
            {
              featureType: "transit",
              stylers: [
                { visibility: "off" }
              ]
            },{
              featureType: "administrative",
              stylers: [
                { visibility: "on" }
              ]
            },{
              featureType: "administrative.country",
              stylers: [
                { visibility: "on" }
              ]
            },{
              featureType: "administrative.province",
             stylers: [
                { visibility: "on" }
              ]
            }
          ]
        };
        this.render();
      }, this));
    },

    render: function () {
      if (!this.map) {
        this.$el.html(this.template());
        if (!window.google || !window.google.maps) return this;
        this.map = new google.maps.Map($('#canvas', this.el).get(0), this.options);
      }      
      return this;
    },

    resize: function() {
      if (window.google && window.google.maps)
        google.maps.event.trigger(this.map, 'resize');
      Backbone.View.prototype.resize.call(this);
    },

  });
});
