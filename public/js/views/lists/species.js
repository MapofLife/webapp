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
      mps.subscribe('species-list-query-results', _.bind(this.receive, this));
      Views.ListView.prototype.initialize.call(this, params, parent);
    },

    render: function (results) { 
      Views.ListView.prototype.render.call(this);
      latHem = (results.listRadius.center.lat() > 0) ? 'N' : 'S';
      lngHem = (results.listRadius.center.lng() > 0) ? 'E' : 'W';
      this.$el.dialog({
        autoOpen: true,
        width: 680,
        height: 415,
        dialogClass: 'mol-Map-ListDialog',
        modal: false,
        title: results.response.total_rows + ' species of ' + results.className +
               ' within ' + results.listRadius.radius/1000 + ' km of ' +
               Math.abs(Math.round(
                   results.listRadius.center.lat()*1000)/1000) +
                   '&deg;&nbsp;' + latHem + '&nbsp;' +
               Math.abs(Math.round(
                   results.listRadius.center.lng()*1000)/1000) +
                   '&deg;&nbsp;' + lngHem
      });
      $('table.listtable tr:odd').addClass('master');
      $('table.listtable tr:not(.master)').hide();
      $('table.listtable tr:first-child').show();
      $('table.listtable tr.master td.arrowBox').click(
          function() {
              $(this).parent().next('tr').toggle();
              $(this).parent().find('.arrow').toggleClass('up');

              if(!$(this).parent().hasClass('hasWiki')) {
                  $(this).parent().addClass('hasWiki');
                  self.callWiki($(this).parent());
              }
          }
      );
      $('.listtable', this.$el).tablesorter({
          sortList: [[5,0]]
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
      this.collection.process();
      this.render(results);
      this.$el.show();
    },

    clear: function (e) {
      this.$el.hide();
      this.collection.reset();
    },

    /*
     * Processes response content for List dialog
     */
    // processListRows: function (listrad, clnm, latH, lngH, rows, sqlurl) {
    //   var self = this,
    //       listradius = listrad,
    //       className = clnm,
    //       latHem = latH,
    //       lngHem = lngH,
    //       tablerows = [],
    //       providers = [],
    //       scientificnames = {},
    //       years = [],
    //       redlistCt = {},
    //       stats,
    //       speciestotal = 0,
    //       speciesthreatened = 0,
    //       speciesdd = 0;

    //   _.each(rows, function (row) {
          
    //     }
    //   );
    //   years = _.uniq(years);
    //   tablerows = _.uniq(tablerows);
    //   providers = _.uniq(providers);

    //   years = _.sortBy(_.uniq(years), function (val) { return val; });

    //   years[years.length-1] = (years.length > 1) ?
    //       ' and ' + years[years.length-1] : years[years.length-1];

    //   _.each(scientificnames, function (red_list_status) {
    //       speciestotal++;
    //       speciesthreatened +=
    //           ((red_list_status.indexOf('EN')>=0) ||
    //            (red_list_status.indexOf('VU')>=0) ||
    //            (red_list_status.indexOf('CR')>=0) ||
    //            (red_list_status.indexOf('EX')>=0) ||
    //            (red_list_status.indexOf('EW')>=0) )  ?
    //               1 : 0;
    //       speciesdd +=
    //           (red_list_status.indexOf('DD')>0)  ?
    //               1 : 0;
    //     }
    //   );

    //   stats = (speciesthreatened > 0) ?
    //       ('(' + speciesthreatened + ' considered threatened by ' +
    //       '<a href="http://www.iucnredlist.org" ' +
    //       'target="_iucn">IUCN</a> '+years.join(',')+')') : '';

    //   if (speciestotal > 0) {
    //     content = $('' +
    //                 '<div class="mol-Map-ListQueryInfo">' +
    //                 '   <div class="mol-Map-ListQuery">' +
    //                        'Data type/source:&nbsp;' +
    //                        providers.join(', ') +
    //                        '.&nbsp;All&nbsp;seasonalities.<br>' +
    //                 '   </div> ' +
    //                 '   <div class="mol-Map-ListQueryInfoWindow"> ' +
    //                 '       <table class="listtable">' +
    //                 '           <thead>' +
    //                 '               <tr>' +
    //                 '                   <th></th>' +
    //                 '                   <th>Scientific Name</th>' +
    //                 '                   <th>English Name</th>' +
    //                 '                   <th>Order</th>' +
    //                 '                   <th>Family</th>' +
    //                 '                   <th>Rank&nbsp;&nbsp;&nbsp;</th>' +
    //                 '                   <th>IUCN&nbsp;&nbsp;</th>' +
    //                 '               </tr>' +
    //                 '           </thead>' +
    //                 '           <tbody class="tablebody">' +
    //                                 tablerows.join('') +
    //                 '           </tbody>' +
    //                 '       </table>' +
    //                 '   </div>' +
    //                 '</div>');

    //     dlContent = $('' +
    //                   '<div class="mol-Map-ListQuery">' +
    //                   '   <div>' +
    //                   '       <a href="' + 
    //                               this.url.format(sqlurl) + '&format=csv"' +
    //                   '           class="mol-Map-ListQueryDownload">' +
    //                   '               download csv</a>' +
    //                   '   </div> ' +
    //                   '</div>');

    //     iucnContent = $('' +
    //                     '<div class="mol-Map-ListQuery mol-Map-ListQueryInfo">' +
    //                     '    <div id="iucnChartDiv"></div>'+
    //                     '    <div class="iucn_stats">' + stats + '</div>' +
    //                     '</div>');
    //   } else {
    //     content = $(''+
    //         '<div class="mol-Map-ListQueryEmptyInfoWindow">' +
    //         '   <b>No ' + className.replace(/All/g, '') +
    //                 ' species found within ' +
    //                 listradius.radius/1000 + ' km of ' +
    //                 Math.abs(
    //                     Math.round(
    //                         listradius.center.lat()*1000)/1000) +
    //                         '&deg;&nbsp;' + latHem + '&nbsp;' +
    //                 Math.abs(
    //                     Math.round(
    //                         listradius.center.lng()*1000)/1000) +
    //                         '&deg;&nbsp;' + lngHem +
    //         '   </b>' +
    //         '</div>');

    //     dlContent = $('' +
    //         '<div class="mol-Map-ListQueryEmptyInfoWindow">' +
    //         '    <b>No list to download.</b>' +
    //         '</div>');

    //     iucnContent = $('' +
    //         '<div class="mol-Map-ListQueryEmptyInfoWindow">' +
    //         '    <b>No species found.</b>' +
    //         '</div>');
    //   }

    //   return {
    //     speciestotal: speciestotal,
    //     content: content,
    //     dlContent: dlContent,
    //     iucnContent: iucnContent
    //   }
    // },

  });
});
