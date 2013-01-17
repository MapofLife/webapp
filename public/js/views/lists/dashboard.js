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
      //this.initDialog();
      mps.subscribe('taxonomy-dashboard-toggle', _.bind(this.toggle, this));
      Views.ListView.prototype.initialize.call(this, params, parent);
    },

    render: function (results) {   
      Views.ListView.prototype.render.call(this);
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
                console.log(dashboard);
                
                
                /*
                self.display = new mol.map.dashboard.DashboardDisplay(
                    response.rows, self.summary
                );
                self.display.dialog(
                    {
                        autoOpen: false,
                        width: 946,
                        height: 600,
                        minHeight: 300,
                        stack: true,
                        dialogClass: "mol-Dashboard",
                        title: 'Dashboard - ' +
                        'Statistics for Data Served by the Map of Life',
                        open: function(event, ui) {
                             $(".mol-Dashboard-TableWindow")
                                .height(
                                    $(".mol-Dashboard").height()-95);

                             //need this to force zebra on the table
                             self.display.dashtable
                                .trigger("update", true);
                        }
                    }
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
        console.log("toggle")
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
                      
      this.collection.reset();
      this.collection.process();
      this.render(results);
    }
    

  });
});
