(function() {
  function testInstalled() {
    return true;
    return (!_.contains(require('fs').readdirSync('.'), '.git') || // Test Development
            ( // Test Windows
              Settings.get('os') === 'windows' && 
              process.cwd().indexOf(process.env.APPDATA) !== -1
            ) ||
            ( // Test Linux
              Settings.get('os') === 'linux' &&
              _.contains(require('fs').readdirSync('.'), 'package.nw')
            ) ||
            ( // Test Mac OS X
              Settings.get('os') === 'mac' &&
              process.cwd().indexOf('Resources/app.nw') !== -1
            ));
  }
  
  // Under Windows, we install to %APPDATA% and the app
  // is in a folder called 'app'. 
  function installWin(dlPath, updateData) {
    var Zip = require('adm-zip'),
      outDir = path.dirname(dlPath),
      installDir = path.join(outDir, 'app');

    var pack = new Zip(dlPath);
    try {
      pack.extractAllTo(installDir, true);
      fs.unlink(dlPath, function(err) {
        if (err) throw err;
        installationComplete(updateData);
      });
    } catch(ex) {
      // It's cool, worst comes to worst, we have a 17mb
      // .nw file lying around :P
    }
  }

  // Under Linux, we package the app alongside the binary
  // in a file called 'package.nw'.
  function installLin(dlPath, updateData) {
    var outDir = path.dirname(dlPath);
    fs.rename(path.join(outDir, 'package.nw'), path.join(outDir, 'package.nw.old'), function(err) {
      if (err) throw err;

      fs.rename(dlPath, path.join(outDir, 'package.nw'), function(err) {
        if(err) {
          if(fs.existsSync(dlPath)) {
            fs.unlink(dlPath, function(err) {
              if (err) throw err;
            });
          }
          throw err;
        } else {
          fs.unlink(path.join(outDir, 'package.nw.old'), function(err) {
            if (err) throw err;
            installationComplete(updateData);
          });
        }
      });
    });
  }

  // Under Mac, we install the app into a folder called 
  // 'app.nw' under the 'Resources' directory of the .app
  function installMac(dlPath, updateData) {
    var Zip = require('adm-zip'),
        outDir = path.dirname(dlPath),
        installDir = path.join(outDir, 'app.nw');
        
    rm(installDir, function(err) {
      if(err) throw err;

      var pack = new Zip(dlPath);
      try {
        pack.extractAllTo(installDir, true);
        fs.unlink(dlPath, function(err) {
          if (err) throw err;
          installationComplete(updateData);
        });
      } catch(ex) {
        // Dunno what to do here :( We deleted the app files, 
        // and now we can't extract it... sheet!
      }
    });
  }

  function installationComplete(updateData) {
    var $el = $('#notification');
    $el.html(
      '<h1>' + updateData.title + ' Installed</h1>'   +
      '<p>&nbsp;- ' + updateData.description + '</p>' +
      '<span class="btn-grp">'                        +
        '<a class="btn btn-default chnglog">Changelog</a>'        +
        '<a class="btn btn-warning restart">Restart Now</a>'      +
      '</span>'
    );

    var $restart = $('.btn.restart'),
        $chnglog = $('.btn.chnglog');

    $restart.on('click', function() {
      var gui = require('nw.gui'),
          spawn = require('child_process').spawn,
          argv = gui.App.fullArgv;
          
      argv.push(CWD);
      spawn(process.execPath, argv, { cwd: CWD, detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] }).unref();
      gui.App.quit();
    });
        
    $chnglog.on('click', function() {
      var $changelog = $('#changelog-container').html(_.template($('#changelog-tpl').html())(updateData));
      $changelog.find('.btn-close').on('click', function() {
        $changelog.hide();
      });
      $changelog.show();
    });

    $('body').addClass('has-notification');
  }


  console.debug('Testing if we should check for update...', testInstalled());
  if (testInstalled()) {
    var request = require('request'),
      fs = require('fs'),
      rm = require('rimraf'),
      path = require('path'),
      crypto = require('crypto');

    var updateUrl = Settings.get('updateNotificationUrl');

    var CWD = process.cwd();
    
    var VERIFY_PUBKEY = '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnmpDYuzgODzPbCkG2FnU\nydlRMueGQypKYk9zt8s1S76hWLiq3gHVRSRI/4rITjhNGGmNXha8tO40161NgSNu\nsgEdW8t6yd2YG7UEAI1pa6Gq0axWHzullVSMLtfOm8BiO+N6o6JmmjZ5C35u3pbn\no9ZgeQqOurLaOt9FXGelKWW96q5qu+VXxhrtcN9TPbj/X0QW0+7sQrGqVntnt3O1\nPbRvQtiuLTKlLakpXuL9Te61V3wPjKRWKYsaHbBtyGte03G6lDBcf8slU1kzgaOP\nZ2T0seyktq7fmHzbYRLd3tzvX8QB38+RNtxyNChThg42s1fgQXvC+/cyeK9NPJlK\n9szLl2OmtFFl/GGHET30MtKjC54lpHAb4gRqE5dGYfYMxdyfkHa1ZNpMPIEOocsg\nQ23kudfHCD6vZXvsXTQlwms8RCRsYYAXB/wZd45Nx4XM9F7LspCqPj0gR7Acu24S\nL0pyStb0SppXHVri4v0DudFMya6sI6x7FoylwmpMY5GBafqsTQ21rAw/BXE/9EAS\nNeyZpTGEQ+v3fQMxrP3qBAAiloE4iBT8gbLbJWj0Qfc4tXuWctHpQN/y5Gu6TObz\nnaoAA8qWAhqoc3Zgs+qtlJ1JIKRmW9crf+ghV9gNheepIjFkV5uidPrWD2R5GezP\nlhzj/04w+BaL3lfYVbtK8+sCAwEAAQ==\n-----END PUBLIC KEY-----\n';

    var checkVersion = function(ver1, ver2) {
      // returns `-` when ver2 less than
      // returns `0` when ver2 equal
      // returns `+` when ver2 greater than
      ver1 = _.map(ver1.replace(/[^0-9.]/g, '').split('.'), function(num) { var n = parseInt(num); return Number.isNaN(n) ? 0 : num; });
      ver2 = _.map(ver2.replace(/[^0-9.]/g, '').split('.'), function(num) { var n = parseInt(num); return Number.isNaN(n) ? 0 : num; });

      var count = Math.max(ver1.length, ver2.length);

      for (var i = 0; i < count; i++) {
        if (ver1[i] === undefined)
          ver1[i] = 0;
        if (ver2[i] === undefined)
          ver2[i] = 0;

        if (i === count - 1) {
          if (ver1[i] === ver2[i])
            return 0;
          if (ver1[i] > ver2[i])
            return 1;
          return -1;
        }

        if (ver1[i] === ver2[i])
          continue;
        if (ver1[i] > ver2[i])
          return 1;
        return -1;
      }
    };

    request(updateUrl, { json: true }, function(err, res, data) {
      if (err || !data) return;

      if (!_.contains(Object.keys(data), Settings.get('os'))) {
        // No update for this OS, FreeBSD or SunOS.
        // Must not be an official binary
        return;
      }

      var updateData = data[Settings.get('os')];

      if(Settings.get('os') === 'linux')
        updateData = updateData[Settings.get('arch')];

      console.debug('Testing if we should install update...', checkVersion(updateData.version, Settings.get('version')) > 0);

      if (checkVersion(updateData.version, Settings.get('version')) > 0) {
        var outDir = Settings.get('os') === 'linux' ? process.execPath : CWD;
        var outputFile = path.join(path.dirname(outDir), 'package.nw.new');
        
        var downloadRequest = request(updateData.updateUrl);
        downloadRequest.pipe(fs.createWriteStream(outputFile));
        downloadRequest.on('complete', function() {
          var hash = crypto.createHash('SHA1'),
              verify = crypto.createVerify('RSA-SHA1');
          
          fs.createReadStream(outputFile)
            .on('data', function(chunk) {
              hash.update(chunk);
              verify.update(chunk);
            })
            .on('end', function() {
              var checksum = hash.digest('hex');
              if (updateData.checksum !== checksum || verify.verify(VERIFY_PUBKEY, updateData.signature, 'base64') === false) {
                // Corrupt download or tampered update
                // Wait until next start to attempt the update again
                if (fs.existsSync(outputFile)) {
                  fs.unlink(outputFile, function(err) {
                    if (err) throw err;
                  });
                }
              } else {
                // Valid update data! Overwrite the old data and move on with life!
                var os = Settings.get('os');
                if (os === 'mac')
                  installMac(outputFile, updateData);
                else if (os === 'linux')
                  installLin(outputFile, updateData);
                else if (os === 'windows')
                  installWin(outputFile, updateData);
                else
                  return;
              }
            });
        });
      }
    });
  }
})();