YouDown.Download = Em.Object.extend(Em.Evented, {
  begin: function() {
    var self = this,
        video = this.get('video');
        
    var command = YouDown.YTDL.getExecutable();
    var options = ['--newline', '--id', '-f',  this.get('formats'), video.get('id')];
    

    var child = require('child_process').execFile(command, options, 
      function(err, stdout, stderr) {
        if (err) return self.trigger('error', err);
        self.finish();
      });
      
    child.stdout.on('data', function(data) {
      self.trigger('progress', data);
    });
    
    child.unref();
    
    process.on('exit', function() {
      if (child && child.kill) child.kill();
    });
    
    this.set('child', child);
  },
  
  finish: function(err) {
    var self = this,
        mv = require('mv'),
        path = require('path'),
        video = this.get('video');
        
    var currentPath = path.join(process.cwd(), video.get('downloadPath'));
    var targetPath = path.join(video.get('queue.saveFolder'), video.get('filename'));
    
    mv(currentPath, targetPath, {mkdirp: true}, function(err) {
      self.trigger('finish', err);
    });
  },
  
  cancel: function() {
    var child = this.get('child');
    if (child && child.kill) child.kill();
  }
});

YouDown.Download.reopenClass({
  start: function(video, formats) {
    var download = YouDown.Download.create({
      video: video,
      formats: formats
    });
    
    return download;
  }
});