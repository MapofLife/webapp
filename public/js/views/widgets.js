// widget views

define([
  'views/widgets/search',
  'views/lists/results'
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
    Results: arguments[1],

    Position: Position
  };

});
