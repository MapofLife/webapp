/*
 * Bootstrap
 */

require.config({
  paths: {
    // libraries
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone: 'libs/backbone/backbone',
    ppGallery: 'libs/ppgallery/ppgallery',
    Qtip: 'libs/qtip/qtip',
    mps: 'libs/minpubsub/minpubsub'
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
  String.prototype.format = function(i, safe, arg) {
    function format() {
      var str = this;
      var len = arguments.length+1;
      
      for (i=0; i < len; arg = arguments[i++]) {
        safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
        str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
      }
      return str;
    }
    format.native = String.prototype.format;
    return format;
  }();  
  App.init();
});
