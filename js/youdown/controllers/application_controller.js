YouDown.ApplicationController = Em.Controller.extend({
  actions: {
    addToQueue: function(video) {
      video.set('queue', this.get('model'));
      this.get('model').addVideo(video);
    }
  },
  
  os: function() {
    return process.platform;
  }.property()
});