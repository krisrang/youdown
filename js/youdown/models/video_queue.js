YouDown.VideoQueue = Em.Object.extend({
  items: Em.A([]),
  
  addVideo: function(video) {
    this.get('items').pushObject(video);
  },
  
  cancelVideo: function(video) {
    
  }
});