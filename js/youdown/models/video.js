// https://www.youtube.com/watch?v=0xJy2QVJTx8

YouDown.Video = Em.Object.extend({
  progressPercent: 0,
  
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
  
  parseProgress: function(out) {
    var self = this,
        messages = out.split('\n');
        
    console.log(out);
        
    _.each(messages, function(message) {
      if (message.indexOf('merging') > 0) return self.set('isMerging', true);
      
      if (message.indexOf('download') === 1) {
        var text = message.replace('[download] ', '');        
        
        var matches = text.match(YouDown.Video.progressRegex);        
        if (matches && matches.length > 0) {
          self.set('progressPercent', matches[1]);
          self.set('totalSize', matches[2]);
          self.set('speed', matches[3]);
          self.set('eta', matches[4]);
        }
        
        var destinationMatches = text.match(/.*Destination:.*.f(.*)\..*/);
        if (destinationMatches && destinationMatches.length === 2) {
          self.set('currentlyDownloadingFormat', destinationMatches[1]);
        }
      }
    });
  },
  
  progressText: function() {
    if (this.get('isMerging')) return i18n.__('merging');
    
    var formatId = this.get('currentlyDownloadingFormat'),
        format = this.get('formats').filterBy('id', formatId)[0],
        audio = format && format.get('audio'),
        percent = this.get('progressPercent'),
        size = this.get('totalSize'),
        speed = this.get('speed');
        
    if (!size) return i18n.__('processing');
    
    return i18n.__('downloadProgress', audio ? 'audio' : 'video',
      percent, size, speed);
  }.property('currentlyDownloadingFormat', 'progressPercent', 'totalSize', 'speed'),
  
  progressCss: function() {
    var percent = 100 - parseFloat(this.get('progressPercent'));
    return "-webkit-transform: translate3d(-" + percent + "%, 0px, 0px)";
  }.property('progressPercent'),
  
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
  progressRegex: /(.*%) of (.*)iB at (.*)iB\/s ETA (.*)/,
  
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
