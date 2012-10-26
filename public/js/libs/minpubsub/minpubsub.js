define([
  'libs/minpubsub/minpubsub.src'
], function () {
  return {
    subscribe: this.subscribe, 
    publish: this.publish,
    hook: this // OMG hack
  };

});
