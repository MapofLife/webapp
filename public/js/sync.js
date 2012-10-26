/*
 * Backbone.sync
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'Backbone',
  'mps',
  'rpc'
], function ($, _, Backbone, mps, rpc) {

  // Map from CRUD to HTTP
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  Backbone.sync = function (method, model, options) {
    var type = methodMap[method],
        verb = '',
        action = {},
        callback = {};
            
    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = { type: type, dataType: 'json' };

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = model._path;
      switch (method) {
        case 'create':
          verb = 'create';
          break;
        case 'update':
          verb = 'update';
          break;
      }
      params.url += verb ? '/' + verb : '';
    }

    if (!options.data) {
      if (model.models) {
        // This is a collection
        if (method === 'read')
          params.data = { parent: model.parent_id }
      }
      else {
        if (method === 'create' || method === 'update')
          params.data = model.attributes;
      }
    }
    
    action = { topic: params.url, data: params.data };
    callback = {success: options.success, error: options.error};
    return rpc.execute(action, callback);
  };

  // Set the default implementation of
  // `Backbone.ajax` to proxy through to `$`.
  Backbone.ajax = function () {
    return $.ajax.apply($, arguments);
  };

  Backbone.wrapError = function (onError, originalModel, options) {
    return function (model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

});
