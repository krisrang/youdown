// https://www.youtube.com/watch?v=0xJy2QVJTx8
// https://www.youtube.com/watch?v=6acRHWnfZAE
// https://www.youtube.com/watch?v=nJHKkkarGSw

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
      var resolution = format.resolution || format.height + 'p';
      
      var newFormat = YouDown.VideoFormat.create({
        format_note: format.format_note,
        preference: format.preference || 0,
        resolution: resolution,
        id: format.format_id,        
        height: format.height,
        vcodec: format.vcodec,
        ext: format.ext,
        url: format.url,
        abr: format.abr,
        display: false
      });
      
      formats.pushObject(newFormat);
    });
    
    _.each(YouDown.Video.formatList, function(format) {
      var candidate = formats.filterBy('resolution', format)
                        .sortBy('preference')
                        .get('lastObject');
                        
      if (candidate) candidate.set('display', true);
    });
    
    this.set('formats', formats);
  },
  
  startDownload: function() {
    var self = this,
        format = this.get('desiredFormat');
    if (!format) return;
        
    var formatString = [format.get('id')];
    if (format.get('dashVideo')) {
      var audio = this.bestAudioFormat();
      formatString.push(audio.get('id'));
    }
    
    this.set('downloadPath', [this.get('id'), this.get('desiredFormat.ext')].join('.'));
    
    var download = YouDown.Download.start(this, formatString.join('+'));
    
    download.on('progress', function(out) { 
      self.parseProgress(out);
    });
    
    download.on('finish', function(err) {
      if (err) return self.set('error', err);
      self.set('finished', true);
      self.set('progressPercent', 100);
    });
    
    download.on('error', function(err) {
      self.set('error', err);
    });
    
    this.set('download', download);
    download.begin();
  },
  
  cancelDownload: function() {
    var download = this.get('download');
    if (download && download.cancel) download.cancel();
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
        
    _.each(messages, function(message) {
      if (Em.isEmpty(message)) return;
      if (message.indexOf('Merging') > 0) return self.set('isMerging', true);
      
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
    if (this.get('error')) return this.get('error');
    if (this.get('finished')) return i18n.__('finished');
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
  }.property('currentlyDownloadingFormat', 'progressPercent', 'totalSize', 'speed', 'isMerging', 'error'),
  
  progressCss: function() {
    var percent = 100 - parseFloat(this.get('progressPercent'));
    return "-webkit-transform: translate3d(-" + percent + "%, 0px, 0px)";
  }.property('progressPercent'),
  
  qualityText: function() {
    return this.get('orderedFormats.firstObject.resolution');
  }.property('orderedFormats'),
  
  thumbnailUrl: function() {
    return 'http://i1.ytimg.com/vi/' + this.get('id') + '/hqdefault.jpg';
  }.property('id'),
  
  orderedFormats: function() {
    return this.get('formats').filterBy('display', true).sortBy('height').reverse();
  }.property('formats', 'formats.@each.height', 'formats.@each.audio')
});

YouDown.Video.reopenClass({
  regex: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_\-]{11}).*$/,
  progressRegex: /(.*%) of (.*)iB at (.*)iB\/s ETA (.*)/,
  formatList: ['1080p', '720p', '480p', '360p', '240p'],
  
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
