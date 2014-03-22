YouDown.FFmpeg = {
  getExecutable: function() {
    var binary = process.platform  === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
    return './bin/' + binary;
  },
  
  mergeFiles: function(in1, in2, out, temp) {
    var FFmpeg = require('fluent-ffmpeg'),
        command = YouDown.FFmpeg.getExecutable();
        
    return new Ember.RSVP.Promise(function(resolve, reject){
      new FFmpeg({ source: in1 })
        .mergeAdd(in2)
        .setFfmpegPath(command)
        .on('error', function(err) {
            reject(err);
        })
        .on('end', function() {
            resolve();
        })
        .mergeToFile(out, temp);
    });
  }
};