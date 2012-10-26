define([
  // dependencies
  'jQuery',
  'mps'
], function ($, mps) {
  return {   
    execute: function(action, callback) {
      var payload = {
        topic: action.topic,
        data: JSON.stringify(action.data)
      },
      jqxhr = $.post('/rpc', payload);
      jqxhr.success(function(response) {
        if (callback)
          callback.success(response);
        mps.publish(action.topic, [response])
      });
      jqxhr.error(function(status, error) {
        if (callback)
          callback.error(status, error);
      });
      return jqxhr;
    },
    action: function(topic, payload) {
      return {topic: topic, payload: payload};
    },
    callback: function(success, error) {
      return {success: success, error: error};
    }
  }
});
