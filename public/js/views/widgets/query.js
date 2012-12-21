/**
 * Species list view for running click radius queries against CartoDB
 */
 
define([
  'jQuery',
  'Underscore',
  'mps',
  'Backbone',
  'models/widget',
  'text!/templates/widgets/query.html',
  'views/lists/species'
], function ($, _, mps, Backbone, Model, template, Results) {
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
      this.results = new Results;
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
      var listRadius,
          dataset_id = $("option:selected", this.$(".dataset_id"))
                        .data( $('.selected',this.$(".types")).val() ),
          className = $("option:selected", this.$(".dataset_id")).text();
      
      listRadius = new google.maps.Circle(
        {
          map: params.map,
          radius: parseInt(this.$('.radius').val())*1000,
          center: params.gmaps_event.latLng,
          strokeWeight: 3,
          strokeColor: 'darkred',
          clickable: false,
          fillOpacity: 0
        }
      );
      
      this.getList(params.gmaps_event.latLng.lat(),
                   params.gmaps_event.latLng.lng(),
                   listRadius,
                   dataset_id,
                   className);
                   
      //ALSO TODO based on this event
      //destroy help tip
      //make sure module is enabled and on
      //fire show-loading-indicator event
      //close existing list windows
                                    
      return this;
    },
    
    getList: function(lat, lng, rad, id, clName) {
      var sql = null,
          csv_sql = null,
          //existing hardcoding of species class
          //not sure if this is still valid, need to check with Jeremy
          cl = (id == "ecoregion_species") ? "Reptilia" : "";
      
      sql = CartoDB.sql.speciesQuery.format(
        id, Math.round(lng*100)/100, Math.round(lat*100)/100, rad.radius, cl);
      csv_sql = CartoDB.sql.speciesQueryCsv.format(
        id, Math.round(lng*100)/100, Math.round(lat*100)/100, rad.radius, cl);
                
      //ALSO TODO to make request
      //make sure no other queries are running
      //toggle running query indicator
      
      $.getJSON(
        CartoDB.url.query.format(sql), 
        _.bind(this.handleQueryResponse(rad, id, cl, clName, csv_sql), this)
      );             
    },
    
    handleQueryResponse: function(rad, id, cl, clName, csv_sql) {
      return function (response) {
        var results = {
                          listRadius: rad,
                          dataset_id: id,
                          cl: cl,
                          className : clName,
                          response: response,
                          sql: csv_sql
                      };
        
        console.log("handleQueryResponse", response);
        this.results.render(response);
        
        mps.publish('species-list-query-results', results); 
      };
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