/**
 * Species List Results view
 */

define([
  'jQuery',
  'Underscore',
  'mps',
  'views/boiler',
  'models/widget',
  'text!/templates/lists/species.html',
  'collections/species',
  'views/rows/species'
], function ($, _, mps, Views, Model, template, Collection, RowView) {
  return Views.ListView.extend({

    attributes: function () {
      return _.extend({
        class: this.model ? 'mol-Map-ListDialogContent ui-tabs' : '',
        id: this.model ? 'tabs' : ''
      }, Views.ListView.prototype.attributes.call(this));
    },
    
    initialize: function (params, parent) {
      this.template = _.template(template);
      this.model = new Model(params);
      this.collection = new Collection();
      this.RowView = RowView;
      mps.subscribe('search-results', _.bind(this.receive, this));
      Views.ListView.prototype.initialize.call(this, params, parent);
    },

    render: function () { 
      Views.ListView.prototype.render.call(this);
      console.log(this.el)
      this.$el.dialog({
        autoOpen: true,
        width: 680,
        height: 415,
        dialogClass: 'mol-Map-ListDialog',
        modal: false,
        title: 'sersdfvsdfbv'
        // title: speciestotal + ' species of ' + className +
        //        ' within ' + listradius.radius/1000 + ' km of ' +
        //        Math.abs(Math.round(
        //            listradius.center.lat()*1000)/1000) +
        //            '&deg;&nbsp;' + latHem + '&nbsp;' +
        //        Math.abs(Math.round(
        //            listradius.center.lng()*1000)/1000) +
        //            '&deg;&nbsp;' + lngHem
      });

      return this;
    },

    events: {
      'click .clearResults': 'clear'
    },
    
    setup: function () {
      return Views.ListView.prototype.setup.call(this);
    },

    receive: function (results) {
      this.model.set('term', results.term);
      this.model.set('time', results.response.time);
      this.model.set('total_rows', results.response.total_rows);
      this.collection.reset(results.response.rows);
      this.render();
      this.$el.show();
    },

    clear: function (e) {
      this.$el.hide();
      this.collection.reset();
    }

  });
});
