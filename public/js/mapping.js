/*
 * This module loads the Google Maps API and then the CartoDB API, putting both
 * into global scope.
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'libs/google/maps/load'
], function ($, _, loadMaps) {
  return {   
    init: function (cb) {
      loadMaps({
        key: 'AIzaSyDJdVhfQhecwp0ngAGzN9zwqak8FaEkSTA',
        geometry: false,
      }).done(function () {
        require(['libs/cartodb/cartodb-gmapsv3'], cb);
      });
    }
  }
});
