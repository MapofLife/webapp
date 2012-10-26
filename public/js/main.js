/*
 * Bootstrap
 */
require.config({
  paths: {
    // libraries
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone: 'libs/backbone/backbone',
    mps: 'libs/minpubsub/minpubsub',
    uikit: 'libs/uikit/uikit'
  },
  // load in the correct order (still asynch)
  shim: {
    mps: {
      exports: 'mps'
    },
    Underscore: {
      exports: '_'
    },
    Backbone: {
      deps: ['jQuery', 'Underscore'],
      exports: 'Backbone'
    },
    uikit: {
      deps: ['jQuery'],
      exports: 'uikit'
    }
  }
});

require([
  // dependencies
  'app',
  'sync',
  'dev' // Uncomment this for dev access via console.
], function (App) {
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }
  App.init();
});
