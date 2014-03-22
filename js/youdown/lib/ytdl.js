YouDown.YTDL = {
  getExecutable: function() {
    var binary = process.platform  === 'win32' ? 'yt.exe' : 'yt';
    return './bin/' + binary;
  },
  
  parseVideo: function(url) {
    var command = YouDown.YTDL.getExecutable(),
        video = YouDown.Video.create({ url: url });
        
    return new Ember.RSVP.Promise(function(resolve, reject){
      var child = require('child_process')
        .execFile(command, ['-j', url], function(err, stdout, stderr) {
          
        if (err) return reject(err);
        
        video.process(stdout);
        resolve(video);
      });
      
      child.unref();
    });
  }
};