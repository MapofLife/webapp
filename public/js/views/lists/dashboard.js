/**
 * Species List Results view
 */

define([
  'jQuery',
  'Underscore',
  'mps',
  'views/boiler',
  'models/widget',
  'text!/templates/lists/dashboard.html',
  'collections/dashboard',
  'views/rows/dashboard'
], function ($, _, mps, Views, Model, template, Collection, RowView) {
  return Views.ListView.extend({

    attributes: function () {
      return _.extend({
        class: this.model ? 'mol-Dashboard' : '',
        id: this.model ? 'dialog' : ''
      }, Views.ListView.prototype.attributes.call(this));
    },
    
    initialize: function (params, parent) {
      console.log("dashboard list init");  
        
      this.template = _.template(template);
      this.model = new Model(params);
      this.collection = new Collection();
      this.RowView = RowView;
      this.isLoaded = false;
      mps.subscribe('taxonomy-dashboard-toggle', _.bind(this.toggle, this));
      mps.subscribe('dashboard-results', _.bind(this.receive, this));
      Views.ListView.prototype.initialize.call(this, params, parent);
    },

    render: function (results) {
      console.log("dashboard render");  
        
      Views.ListView.prototype.render.call(this);
      
      this.$el.dialog({
        autoOpen: false,
        width: 946,
        height: 600,
        minHeight: 300,
        stack: true,
        dialogClass: "mol-Dashboard",
        title: 'Dashboard - ' +
            'Statistics for Data Served by the Map of Life',
        open: function(event, ui) {
          //$(".mol-Dashboard-TableWindow").height($(".mol-Dashboard").height()-95);

          //need this to force zebra on the table
          //this.$el.dashtable.trigger("update", true);
        }
      });
      
      return this;
    },

    events: {
      
    },
    
    setup: function () {    
      return Views.ListView.prototype.setup.call(this);
    },
    
    initDialog: function() {
        console.log("init");
        console.log(CartoDB);
        
        //WHEN IS CartoDB available?
        
        $.getJSON(
            CartoDB.url.sql.format(CartoDB.sql.dashboardSql),
            function(response) {
                console.log('dashboard response');
                console.log(response);
                
                mps.publish('dashboard-results', response);
                /*
                self.display = new mol.map.dashboard.DashboardDisplay(
                    response.rows, self.summary
                );
                $(".mol-Dashboard").parent().bind("resize", function() {
                    $(".mol-Dashboard-TableWindow")
                        .height($(".mol-Dashboard").height()-95);
                });
                self.addEventHandlers();
                */
                
            }
        );

        /*
        $.getJSON(
            mol.services.cartodb.sqlApi.jsonp_url.format(this.summary_sql),
            function(response) {
                self.summary = response.rows[0];
                if(self.display) {
                    self.display.fillSummary(self.summary);
                }
            }
        );
        */
    },
    
    toggle: function() {
        if(this.$el.dialog('isOpen')) {
            this.$el.dialog("close");
        } else {
            if(this.isLoaded) {
                this.$el.dialog("open");
            } else {
                this.isLoaded = true;
                this.initDialog();
                this.$el.dialog("open");
            }
        }
    },

    row: function (model) {
      var view = new this.RowView({ model: model }, this);
      this.views.push(view);
      return view.toHTML()
          + '<tr class="tablesorter-childRow">'
          + '<td colspan="7" value="' + model.get('scientificname')
          + '"></td></tr>';
    },

    receive: function (results) {
      console.log("dashboard receive");
      
      /*  
      this.model.set('term', results.term);
      this.model.set('time', results.response.time);
      this.model.set('total_rows', results.response.total_rows);
      this.model.set('sqlurl', CartoDB.url.query
                                .format(
                                  encodeURIComponent(results.sql)) +
                                '&format=csv');                         
      this.collection.reset(results.response.rows);
      */
            
      this.collection.reset(results);
      this.collection.process();
      this.render(results);
    }
    

  });
});
