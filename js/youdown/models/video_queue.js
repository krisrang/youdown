YouDown.VideoQueue = Em.Object.extend({
  saveFolder: process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'],
  
  items: Em.A([]),
  
  addVideo: function(video) {
    this.get('items').pushObject(video);
    video.startDownload();
  },
  
  cancelVideo: function(video) {
    video.cancelDownload();
    this.get('items').removeObject(video);
  }
});