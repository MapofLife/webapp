/**
 * Species List Results view
 */

define([
  'jQuery',
  'Underscore',
  'Qtip',
  'ppGallery',
  'mps',
  'views/boiler',
  'models/widget',
  'text!/templates/lists/species.html',
  'collections/species',
  'views/rows/species'
], function ($, _, qtip, ppGallery, mps, Views, Model, template, Collection, RowView) {
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
      var mmlHeight,
          iucnlist,
          iucndata,
          options,
          chart,
          english;
          
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

      $(".mol-Map-ListDialog").parent().bind("resize", function() {
        $(".mol-Map-ListQueryInfoWindow")
            .height($(".mol-Map-ListDialog").height()-125);

        $("#gallery")
            .height($(".mol-Map-ListDialog").height()-125);
      });
      
      //initialize tabs and set height
      listTabs = $("#tabs").tabs();

      $(".mol-Map-ListQueryDownload").button();
      mmlHeight = $(".mol-Map-ListDialog").height();
      $(".mol-Map-ListQueryInfoWindow").height(mmlHeight-125);
      $("#gallery").height(mmlHeight-125);

      //Setup events on the table
      var self = this;
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

      _.each($('.wiki', this.$el), function (wiki) {
        $(wiki).click(function (event) {
          var win = window.open(
            'http://en.wikipedia.com/wiki/'+
            $(this).text().split(',')[0]
                .replace(/ /g, '_')
          );
          win.focus();
        });
      });

      _.each($('.iucn', this.$el), function (iucn) {
        if ($(iucn).data('scientificname') != '') {
          $(iucn).click(function (event) {
            var win = window.open(
              'http://www.iucnredlist.org/' +
              'apps/redlist/search/external?text='
              +$(this).data('scientificname')
            );
            win.focus();
          });
        }
      });

      listTabs.tabs("select", 0);
      
      //iucn pie chart
      $("#iucnChartDiv").height(mmlHeight-140);

      iucnlist = this.getRedListCounts(results.response.rows);
      iucndata = google.visualization.arrayToDataTable(iucnlist);

      options = {
        width: 605,
        height: $("#iucnChartDiv").height(),
        backgroundColor: 'transparent',
        title: 'Species by IUCN Status',
        colors: ['#006666',
                 '#88c193',
                 '#cc9900',
                 '#cc6633',
                 '#cc3333',
                 '#FFFFFF',
                 '#000000'],
        pieSliceText: 'none',
        chartArea: {left:125, top:25, width:"100%", height:"85%"}
      };

      chart = new google.visualization.PieChart(
        document.getElementById('iucnChartDiv'));
      chart.draw(iucndata, options);
      
      /*
       * Just putting this in here for now
       * will migrate it to a RowView when and if possible.
       */
      
      //image gallery
      _.each(
        results.response.rows,
        function(row) {
          english = (row.english != null) ?
            _.uniq(row.english.split(',')).join(',') : '';

          if(row.thumbsrc != null) {
            $("#gallery").append('' +
              '<li><a class="eol_img" href="http://eol.org/pages/' +
              row.eol_page_id +
              '" target="_blank"><img src="' +
              row.thumbsrc +
              '" title="' +
              english +
              '" sci-name="' +
              row.scientificname + '"/></a></li>');
          } else {
            $("#gallery").append('' +
              '<li><div style="width:91px; height:68px"' +
              'title="' + english +
              '" sci-name="' + row.scientificname +
              '">No image for ' +
              english + '.</div></li>');
          }
        }
      );

      $('#gallery').ppGallery({thumbWidth: 91, maxWidth: 635});                  

      $('#gallery li a img').qtip({
        content: {
          text: function(api) {
            return '<div>' + $(this).attr('oldtitle') +
                '<br/><button class="mapButton" value="' +
                $(this).attr('sci-name') +
                '">Map</button>' +
                '<button class="eolButton" value="' +
                $(this).parent().attr('href') +
                '">EOL</button></div>';
          }
        },
        hide: {
          fixed: true,
          delay: 500
        },
        events: {
          visible: function(event, api) {
            $("button.mapButton").click(
              function(event) {
                var terms = {source: 'query', 
                             term : $.trim(event.target.value)};
                mps.publish('search', [terms]);
              }
            );

            $('button.eolButton').click(
              function(event) {
                var win = window.open(
                    $.trim(event.target.value)
                );
                win.focus();
              }
            );
          }
        }
      });

      $('#gallery li div').qtip({
        content: {
          text: function(api) {
            return '<div>' + $(this).attr('title') +
                '<br/><button class="mapButton" value="' +
                $(this).attr('sci-name') +
                '">Map</button></div>';
          }
        },
        hide: {
          fixed: true,
          delay: 500
        },
        events: {
          visible: function(event, api) {
            $("button.mapButton").click(function(event) {
              var terms = {source: 'query', 
                           term : $.trim(event.target.value)};
              mps.publish('search', [terms]);
            });
          }
        }
      });
      
      //end gallery

      this.$el.dialog({
         beforeClose: function(evt, ui) {
           listTabs.tabs("destroy");
           $(".mol-Map-ListDialogContent").remove();
         }
      });

      return this;
    },

    events: {
      'click .clearResults': 'clear'
    },
    
    setup: function () {
      return Views.ListView.prototype.setup.call(this);
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
      this.model.set('term', results.term);
      this.model.set('time', results.response.time);
      this.model.set('total_rows', results.response.total_rows);
      this.model.set('sqlurl', CartoDB.url.query
                                .format(
                                  encodeURIComponent(results.sql)) +
                                '&format=csv');                         
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
     * Callback for Wikipedia Json-P request
     */
    wikiCallback: function(data, row,q,qs,eolimg,eolpage) {
      var wikidata,
          wikiimg,
          prop,
          a,
          imgtitle,
          req,
          reqs,
          i,
          e,
          self = this;

      for(e in data.query.pages) {
        if(e != -1) {
          prop = data.query.pages[e];
          wikidata = prop.extract
              .replace('...','')
              .replace('<b>','<strong>')
              .replace('<i>','<em>')
              .replace('</b>','</strong>')
              .replace('</i>','</em>')
              .replace('<br />',"")
              .replace(/<p>/g,'<div>')
              .replace(/<\/p>/g,'</div>')
              .replace(/<h2>/g,'<strong>')
              .replace(/<\/h2>/g,'</strong>')
              .replace(/<h3>/g,'<strong>')
              .replace(/<\/h3>/g,'</strong>')
              .replace(/\n/g,"")
              .replace('</div>\n<div>'," ")
              .replace('</div><div>'," ")
              .replace('</div><strong>'," <strong> ")
              .replace('</strong><div>'," </strong> ");

          $(row).next().find('td').html(wikidata);
          $(row).next().find('td div br').remove();

          a = prop.images;

          for(i=0;i < a.length;i++) {
            imgtitle = a[i].title;

            req = new RegExp(q, "i");
            reqs = new RegExp(qs, "i");

            if(imgtitle.search(req) != -1 ||
               imgtitle.search(reqs) != -1) {
              wikiimg = imgtitle;
              break;
            }
          }
        }

        if(eolimg != "null") {
          $('<a href="http://eol.org/pages/' +
            eolpage +
            '" target="_blank"><img src="' +
            eolimg +
            '" style="float:left; margin:0 4px 0 0;"/>' +
            '</a>').prependTo($(row).next().find('td'));
          $(row).next().find('td div:last').append('' +
            '... (Text Source:' +
            '<a href="http://en.wikipedia.com/wiki/' +
            qs.replace(/ /g, '_') +
            '" target="_blank">Wikipedia</a>;' +
            ' Image Source:<a href="http://eol.org/pages/' +
            eolpage +
            '" target="_blank">EOL</a>)' +
            '<p><button class="mapButton" value="' +
            qs + '">Map</button></p>');
        } else if(wikiimg != null) {
          //get a wikipedia image if we have to
          $.getJSON(
              'http://en.wikipedia.org/w/api.php?' +
              'action=query' +
              '&prop=imageinfo' +
              '&format=json' +
              '&iiprop=url' +
              '&iilimit=10' +
              '&iiurlwidth=91' +
              '&iiurlheight=68' +
              '&titles={0}'.format(wikiimg) +
              '&callback=?'
          ).success(
            function(data) {
              self.wikiImgCallback(data, qs, wikiimg)
            }
          );
        }

        //check for link to eol, if true, add button
        if(eolpage != "null") {
          $(row).next().find('td p:last').append('' +
          '<button class="eolButton" ' +
          'value="http://eol.org/pages/' +
          eolpage + '">Encyclopedia of Life</button>');

          $('button.eolButton[value="http://eol.org/pages/' +
            eolpage + '"]').click(function(event) {
            var win = window.open($.trim(event.target.value));
            win.focus();
          });
        }

        $(row).find('td.arrowBox').html("<div class='arrow up'></div>");
      }


      $("button.mapButton").click(
        function(event) {
          var terms = {source: 'query', 
                       term : $.trim(event.target.value)};
          mps.publish('search', [terms]);
        }
      );
    },

    /*
     *  Callback for Wikipedia image json-p request.
     */
    wikiImgCallback: function(data, qs, wikiimg) {
      var imgurl,
          x,
          z;

      for(x in data.query.pages) {
        z = data.query.pages[x];
        imgurl = z.imageinfo[0].thumburl;

        $('<a href="http://en.wikipedia.com/wiki/' +
          qs.replace(/ /g, '_') +
          '" target="_blank"><img src="' +
          imgurl +
          '" style="float:left; margin:0 4px 0 0;"/>')
         .prependTo($(row).next().find('td'));
        $(row).next().find('td div:last')
          .append('' +
          '... (Text Source:' +
          '<a href="http://en.wikipedia.com/wiki/' +
          qs.replace(/ /g, '_') +
          '" target="_blank">Wikipedia</a>;' +
          ' Image Source:' +
          '<a href="http://en.wikipedia.com/wiki/' +
          wikiimg +
          '" target="_blank">Wikipedia</a>)' +
          '<p><button class="mapButton" value="' +
          qs +
          '">Map</button></p>');
      }
    },

    /*
     *  Put html in saying information unavailable...
     */
    wikiError: function(row) {
      $(row).find('td.arrowBox').html("<div class='arrow up'></div>");
      $(row).next().find('td').html('<p>Description unavailable.</p>');
    },

    /*
     * Function to call Wikipedia and EOL image
     */
    callWiki: function(row) {
      var q,
          qs,
          eolimg,
          eolpage,
          self = this;

      $(row).find('td.arrowBox').html('' +
        '<img src="/img/loading-small.gif" width="' +
        $(row).find('td.arrowBox').height() +'" height="' +
        $(row).find('td.arrowBox').width() + '" />');

      q = $(row).find('td.english').html();
      qs = $(row).find('td.sci').html();
      eolimg = $(row).find('td.sci').attr('value');
      eolpage = $(row).find('td.english').attr('eol-page');

      $.getJSON(
          "http://en.wikipedia.org/w/api.php?" +
          "action=query" +
          "&format=json" +
          "&callback=test" +
          "&prop=extracts|images" +
          "&imlimit=10" +
          "&exlimit=1" +
          "&redirects=" +
          "exintro=" +
          "&iwurl=" +
          "&titles=" + qs +
          "&exchars=275" +
          '&callback=?'
      ).success (
        function(data) {
          self.wikiCallback(data, row,q,qs,eolimg,eolpage)
        }
      ).error(
        function(data) {
          self.wikiError(row);
        }
      );
    },
    
    /*
     * Bins the IUCN species for a list query request into categories
     * and returns an associate array with totals
     */
    getRedListCounts: function(rows) {
      var iucnListArray = [
            ['IUCN Status', 'Count'],
            ['LC',0],
            ['NT',0],
            ['VU',0],
            ['EN',0],
            ['CR',0],
            ['EW',0],
            ['EX',0]
          ], 
          redlist;

      _.each(rows, function(row) {
        redlist = (row.redlist != null) ?
          _.uniq(row.redlist.split(',')).join(',') : '';

        switch(redlist) {
          case "LC":
            iucnListArray[1][1]++;
            break;
          case "NT":
            iucnListArray[2][1]++;
            break;
          case "VU":
            iucnListArray[3][1]++;
            break;
          case "EN":
            iucnListArray[4][1]++;
            break;
          case "CR":
            iucnListArray[5][1]++;
            break;
          case "EW":
            iucnListArray[6][1]++;
            break;
          case "EX":
            iucnListArray[7][1]++;
            break;
        }
      });

      return iucnListArray;
    },

  });
});
