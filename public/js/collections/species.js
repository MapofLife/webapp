/*
 * Species List Results collection
 */

define([
  // dependencies
  'Underscore',
  'Backbone',
  'models/species'
], function (_, Backbone, Model) {
  return Backbone.Collection.extend({

    initialize: function () {
      this.providers = [];
      this.scientificnames = {};
      this.years = [];
      this.redlistCt = {};
      this.stats;
      this.speciestotal = 0;
      this.speciesthreatened = 0;
      this.speciesdd = 0;
      this.numImgs = 0;
    },

    process: function () {
      this.years = _.uniq(this.years);
      this.providers = _.uniq(this.providers);
      this.years = _.sortBy(_.uniq(this.years), function (val) { return val; });

      this.years[this.years.length-1] = (this.years.length > 1) ?
          ' and ' + this.years[this.years.length-1] : this.years[this.years.length-1];

      _.each(this.scientificnames, _.bind(function (red_list_status) {
        this.speciestotal++;
        this.speciesthreatened +=
            ((red_list_status.indexOf('EN')>=0) ||
             (red_list_status.indexOf('VU')>=0) ||
             (red_list_status.indexOf('CR')>=0) ||
             (red_list_status.indexOf('EX')>=0) ||
             (red_list_status.indexOf('EW')>=0) )  ? 1 : 0;
        this.speciesdd += (red_list_status.indexOf('DD')>0)  ? 1 : 0;
      }, this));

      this.stats = (this.speciesthreatened > 0) ?
          ('(' + this.speciesthreatened + ' considered threatened by ' +
          '<a href="http://www.iucnredlist.org" ' +
          'target="_iucn">IUCN</a> '+this.years.join(',')+')') : '';
    },

    model: Model

  });
});
