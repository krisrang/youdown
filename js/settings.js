window.Settings = {
  "_defaultSettings": {
    // Default to the first beta
    "version": "0.3.0",
    // Used to check for the latest version
    "updateNotificationUrl": "http://youdown.kristjanrang.eu/update.json"
  },


  "setup": function(forceReset) {
    if( typeof Settings.get('version') === 'undefined' ) {
      window.__isNewInstall = true;
    }
    
    for( var key in Settings._defaultSettings ) {
      // Create new settings if necessary
      if( typeof Settings.get(key) === 'undefined' || (forceReset === true) ) {
        Settings.set(key, Settings._defaultSettings[key]);
      }
    }
    
    Settings.performUpgrade();
    Settings.getHardwareInfo();
  },
  
  "performUpgrade": function() {
      // This gives the official version (the package.json one)
      var gui = require('nw.gui');
      var currentVersion = gui.App.manifest.version;

      if (currentVersion !== Settings.get('version') ) {
        
        if (Settings.get('updateNotificationUrl') !== 'http://youdown.kristjanrang.eu/update.json')
            Settings.set('updateNotificationUrl', Settings._defaultSettings['updateNotificationUrl']);

        // Add an upgrade flag
        window.__isUpgradeInstall = true;
      }

      Settings.set('version', currentVersion);
    },
  
  "get": function(variable) {
    return localStorage['settings_'+variable];
  },

  "set": function(variable, newValue) {
    localStorage.setItem('settings_'+variable, newValue);
  },

  "getHardwareInfo": function() {
    if(/64/.test(process.arch))
      Settings.set('arch', 'x64');
    else
      Settings.set('arch', 'x86');

    switch(process.platform) {
      case 'darwin':
        Settings.set('os', 'mac');
        break;
      case 'win32':
        Settings.set('os', 'windows');
        break;
      case 'linux':
        Settings.set('os', 'linux');
        break;
      default:
        Settings.set('os', 'unknown');
        break;
    }
  }
};

Settings.setup();