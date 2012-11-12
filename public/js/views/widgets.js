// widget views

define([
  'views/widgets/search'
  ], function () {

  Position = {
    FIRST: '.FIRST',
    TOP: '.TOP',
    MIDDLE: '.MIDDLE',
    BOTTOM: '.BOTTOM',
    LAST: '.LAST'
  };

  return {
    Search: arguments[0],

    Position: Position
  };

});
