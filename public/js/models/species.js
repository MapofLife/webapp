/*
 * Species List Result model
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'util'
], function ($, _, Backbone, util) {
  return Backbone.Model.extend({

    initialize: function (params) {
      
      this.set('id', util.makeId(7));
      this.set('english', (params.english != null) ?
                    _.uniq(params.english.split(',')).join(',') : '');
      this.set('year', (params.year_assessed != null) ?
                    _.uniq(params.year_assessed.split(',')).join(',') : '');
      this.set('redlist', (params.redlist != null) ?
                    _.uniq(params.redlist.split(',')).join(',') : '');
      this.set('tclass', '');

      //create class for 3 threatened iucn classes
      switch (this.get('redlist')) {
        case 'VU':
          this.set('tclass', 'iucnvu');
          break;
        case 'EN':
          this.set('tclass', 'iucnen');
          break;
        case 'CR':
          this.set('tclass', 'iucncr');
          break;
      }

      this.collection.providers.push(
          ('<a class="type {0}">{1}</a>, <a class="provider {2}">{3}</a>')
          .format(params.type,
                  params.type_title,
                  params.provider,
                  params.provider_title)
      );
      
      if (this.get('year') != null && this.get('year') != '')
        this.collection.years.push(this.get('year'));
      
      this.collection.scientificnames[params.scientificname] = this.get('redlist');
      
      if(params.thumbsrc != null && params.thumbsrc != '')
        this.collection.numImgs++;
    },

  });
});