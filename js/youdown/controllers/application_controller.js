YouDown.ApplicationController = Em.Controller.extend({
  actions: {
    addToQueue: function(video) {
      this.get('model').addVideo(video);
    }
  },
  
  os: function() {
    return process.platform;
  }.property()
});