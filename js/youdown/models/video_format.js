YouDown.VideoFormat = Em.Object.extend({
  audio: Em.computed.equal('vcodec', 'none'),
  dashVideo: Em.computed.equal('format_note', 'DASH video'),
  
  displayText: function() {
    var resolution = this.get('audio') ? 'Audio' : this.get('height') + 'p',
        type = this.get('ext').toUpperCase();
        
    return type + ' ' + resolution;
  }.property('vcodec', 'height', 'ext')
});