YouDown.ApplicationRoute = Em.Route.extend({  
  model: function() {
    return YouDown.VideoQueue.create();
  }
});