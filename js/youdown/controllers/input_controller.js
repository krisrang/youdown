YouDown.InputController = Em.Controller.extend({
  status: 'ready',
  
  processing: Em.computed.equal('status', 'processing'),
  done: Em.computed.equal('status', 'done'),
  
  actions: {
    download: function() {
      this.set('status', 'processing');
      this.set('qualityText', '1080p');
    }
  },
  
  urlChange: function() {
    var url = this.get('videoUrl');
    if (YouDown.Video.matches(url)) return this.process(url);
    return this.reset();
  }.observes('videoUrl'),
  
  inputsDisabled: function() {
    return !this.get('video');
  }.property('status'),
  
  targets: function() {
    if (!this.get('video')) return Em.A([]);
    
    return this.get('video.orderedFormats');
  }.property('video'),
  
  reset: function() {
    this.set('status', 'ready');
    this.set('video', null);
  },
  
  process: function(url) {
    var self = this;
    this.set('status', 'processing');
    
    YouDown.Video.createVideo(url).then(function(video) {
      self.set('video', video);
      self.set('status', 'done');
    });
  }
});