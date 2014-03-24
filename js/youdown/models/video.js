// https://www.youtube.com/watch?v=0xJy2QVJTx8

YouDown.Video = Em.Object.extend({
  destination: '/Users/kris/downloads',
  
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
        vcodec: format.vcodec,
        abr: format.abr,
        format_note: format.format_note
      });
      
      formats.pushObject(vformat);
    });
    
    this.set('formats', formats);
  },
  
  startDownload: function() {
    var format = this.get('desiredFormat');
    if (!format) return;
    
    var formatString = [format.get('id')];
    if (format.get('dashVideo')) {
      var audio = this.bestAudioFormat();
      formatString.push(audio.get('id'));
    }
    
    YouDown.YTDL.downloadVideo(this, formatString.join('+')).then(function() {
      console.log('yay');
    }, function(err) {
      console.log(err);
    });
  },
  
  cancelDownload: function() {
    
  },
  
  bestAudioFormat: function() {
    return this.get('formats')
      .filterBy('audio', true)
      .sortBy('abr')
      .get('lastObject');
  },
  
  parseProgress: function(prog) {
    console.log(prog);
    this.set('progressText', prog);
  },
  
  // progressText: function() {
  //   return i18n.__(this.get('progress'));
  // }.property('progress'),
  
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
