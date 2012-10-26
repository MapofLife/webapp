define([
  // dependencies
  'jQuery',
  'mps'
], function ($, mps) {
  
  // The channel object.
  var channel = null;

  // The channel handler.
  var handler = {
    onopen: function () {
      mps.publish('bus/onopen', [{}]);
    },    
    onmessage: function (message) { // Don't propogate to avoid infinite event looping.
      var event = JSON.parse(message.data),
          topic = event.topic ? event.topic : 'bus/onmessage',
          data = JSON.parse(event.data);
      mps.publish(topic, [data]);
    },
    onerror: function (error) {
      mps.publish('bus/onerror', [error]);
    },    
    onclose: function () {
      mps.publish('bus/onclose', [{}]);
    }
  }
  
  return {   
    init: function () {
      // Open the bus channel.
      $.post('/bus/token', function (data) {
        channel = new goog.appengine.Channel(data.token);
        channel.open(handler);
      });

      // Hook in the mps.bus so we can handle all events:
      mps.hook.bus = function (topic, params) {
        var event = {topic: topic, data: JSON.stringify(params)};       
        console.log(event);
      };
    }
  }
});
