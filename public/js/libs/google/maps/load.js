/*
 * Google Maps Loader
 * Rewritten for MOL
 * https://gist.github.com/828536
 */
 
define([
  // dependencies
  'jQuery',
  'Underscore'
], function ($, _) {
  
  var now = $.now();
  var promise;

  return function (options) {

    if (promise) return promise;

    var deferred = $.Deferred();
    var resolve = function () {
      deferred.resolve(window.google &&
                      google.maps ? google.maps : false);
    };

    // Default Parameters
    _.defaults(options, {
      v: 3,
      sensor: false,
      callback: 'initgoomaps_' + (now++)
    });

    if (window.google && google.maps) resolve();
    else if (window.google && google.load)
      google.load('maps', options.v, {
        other_params: $.param(params),
        callback: resolve
      });
    else {

      window[options.callback] = function () {

        resolve();
        setTimeout(function () {
          try {
            delete window[options.callback];
          } catch (e) {}
        }, 20);
      };

      $.ajax({
        dataType: 'script',
        data: options,
        url: 'https://maps.google.com/maps/api/js'        
      });

    }

    promise = deferred.promise(); 

    return promise;
  };
});
