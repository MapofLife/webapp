// widget views

define([
  'views/widgets/search',
  'views/lists/results',
  'views/widgets/query',
  'views/widgets/menu'
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
    Query: arguments[2],
    Menu: arguments[3],

    Position: Position
  };

});
