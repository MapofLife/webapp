/**
 * This module loads the Google Maps API and then the CartoDB API, putting both
 * into global scope as "google" and "CartoDB", respectively. 
 */

define([
  // dependencies
  'jQuery',
  'Underscore',
  'libs/google/maps/load'
], function ($, _, loadGoogleMaps) {
  return {   

    /**
     * Loads the Google Maps API and then the CartoDB API. Fires the callback
     * after both are loaded.
     * 
     * @param cb The callback function.
     */
    init: function (cb) {
      loadGoogleMaps({
        key: 'AIzaSyDJdVhfQhecwp0ngAGzN9zwqak8FaEkSTA',
        geometry: false,
      }).done(function () {
        require(['libs/cartodb/cartodb-gmapsv3'], cb);
      });
    }
  }
});
