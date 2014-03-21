YouDown.ApplicationController = Em.Controller.extend({
  actions: {
  },
  
  os: function() {
    return process.platform;
  }.property()
});