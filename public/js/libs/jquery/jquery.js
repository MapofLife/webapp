define([
  'libs/jquery/js/jquery.min'
], function () {

  jQuery.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    jQuery.each(a, function () {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push)
          o[this.name] = [o[this.name]];
        o[this.name].push(this.value || '');
      } else o[this.name] = this.value || '';
    });
    return o;
  };

  require(['libs/jquery/js/jquery.easing.min',
           'libs/jquery/js/jquery.hotkeys',
           'libs/jquery/js/jquery-ui-1.8.18.custom.min',
           // 'libs/jquery/js/jquery.ui.core',
           // 'libs/jquery/js/jquery.ui.widget',
           // 'libs/jquery/js/jquery.ui.autocomplete',
           // 'libs/jquery/js/jquery.ui.autocomplete.regexp'
           // 'libs/jquery/js/jquery.ui.position'
           ]);

  return jQuery;
});
