YouDown.QueueController = Em.Controller.extend({
  actions: {
    cancelVideo: function(video) {
      this.get('model').cancelVideo(video);
    }
  },
  
  os: function() {
    return process.platform;
  }.property()
});