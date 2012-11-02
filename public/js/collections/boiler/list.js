/*
 * List collection
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone) {
  return Backbone.Collection.extend({

    fetch: function (options, cb) {
      if ('function' === typeof(options)) {
        cb = options;
        options = {};
      }
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      options.success = function (res, status, xhr) {
        collection[options.add ? 'add' : 'reset']
            (collection.parse(res, xhr), options);
        if (cb) cb(collection, res);
        collection.trigger('fetched');
      };
      options.error = Backbone.wrapError(this.error,
                                        collection, options);
      return (this.sync || Backbone.sync)
              .call(this, 'read', this, options);
    },

    error: function (col, res) {
      console.warn(res);
    }

  });
});
