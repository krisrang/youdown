// https://www.youtube.com/watch?v=0xJy2QVJTx8

YouDown.Video = Em.Object.extend({
  process: function(result) {
    var json = JSON.parse(result),
        formats = Em.A([]);
    this.set('id', json["display_id"]);
    this.set('title', json["title"]);
    this.set('description', json["description"]);
    this.set('filename', json["_filename"]);
    
    _.each(json["formats"], function(format) {
      if (format['ext'] === 'webm' || format['ext'] === '3gp') return;
      
      var vformat = YouDown.VideoFormat.create({
        ext: format.ext,
        id: format.format_id,
        url: format.url,
        height: format.height,
        vcodec: format.vcodec
      });
      
      formats.pushObject(vformat);
    });
    
    this.set('formats', formats);
  },
  
  qualityText: function() {
    return this.get('orderedFormats.firstObject.height') + 'p';
  }.property('formats'),
  
  orderedFormats: function() {
    return this.get('formats').sortBy('height').reverse();
  }.property('formats'),
  
  thumbnailUrl: function() {
    return 'http://i1.ytimg.com/vi/' + this.get('id') + '/hqdefault.jpg';
  }.property('id')
});

YouDown.Video.reopenClass({
  regex: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_\-]{11}).*$/,
  
  matches: function(url) {
    return new RegExp(YouDown.Video.regex).test(url);
  },
  
  createVideo: function(url) {
    return new Ember.RSVP.Promise(function(resolve, reject){
      if (!YouDown.Video.matches(url)) return reject();
      YouDown.YTDL.parseVideo(url).then(function(video) { resolve(video); });
    });
  }
});
