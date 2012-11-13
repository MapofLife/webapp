/*
 * App utility functions
 */
define([
  // dependencies
  'jQuery',
  'Underscore'
], function ($, _) {

  return {

    layerId: function (layer) {
      var name = $.trim(layer.name.toLowerCase()).replace(/ /g, "_");
      var type = $.trim(layer.type.toLowerCase()).replace(/ /g, "_");
      var source = $.trim(layer.source.toLowerCase()).replace(/,/g, "").replace(/ /g, "_");
      var data_table = $.trim(layer.dataset_id).replace(/,/g, "").replace(/ /g, "_");
      return 'layer--{0}--{1}--{2}--{3}'.format(name, type, source, data_table);
    },

  }

});
