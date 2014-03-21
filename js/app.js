var applicationRoot = './',    
    gui             = require('nw.gui'),
    isDebug         = gui.App.argv.indexOf('--debug') > -1,
    win             = gui.Window.get(),
    os              = require('os'),
    path            = require('path'),
    fs              = require('fs'),
    url             = require('url'),
    i18n            = require("i18n"),
    raven           = require("raven"),
    
    _               = require('./js/vendor/lodash'),
    config          = require('./js/config'),
    
    isWin           = (process.platform === 'win32'),
    isLinux         = (process.platform === 'linux'),
    isOSX           = (process.platform === 'darwin');

config.button_order = ['min', 'max', 'close'];
if (isOSX) { config.button_order = ['close', 'min', 'max']; }

// Not debugging, hide all messages!
if (!isDebug) {
  console.log = function () {};
} else {
  // Developer Menu building
  var menubar = new gui.Menu({ type: 'menubar' }),
    developerSubmenu = new gui.Menu(),
    developerItem = new gui.MenuItem({
     label: 'Developer',
     submenu: developerSubmenu
    }),
    debugItem = new gui.MenuItem({
      label: 'Show developer tools',
      click: function () {
        win.showDevTools();
      }
    });
  menubar.append(developerItem);
  developerSubmenu.append(debugItem);
  win.menu = menubar;

  // Developer Shortcuts
  document.addEventListener('keydown', function(event){
    // F12 Opens DevTools
    if( event.keyCode === 123 ) { win.showDevTools(); }
    // F11 Reloads
    if( event.keyCode === 122 ) { win.reloadIgnoringCache(); }
  });
  
  win.showDevTools();
}

// Set the app title (for Windows mostly)
win.title = 'YouDown';

// Focus the window when the app opens
win.focus();

// Cancel all new windows (Middle clicks / New Tab)
win.on('new-win-policy', function (frame, url, policy) {
  policy.ignore();
});

var preventDefault = function(e) { e.preventDefault(); };

// Prevent dropping files into the window
window.addEventListener("dragover", preventDefault, false);
window.addEventListener("drop", preventDefault, false);
// Prevent dragging files outside the window
window.addEventListener("dragstart", preventDefault, false);

var ravenClient = new raven.Client(config.raven);
window.RavenClient = ravenClient;

if (!isDebug) {
  ravenClient.patchGlobal(function(logged, err) {
    // if (console) console.log(err);
    process.exit(1);
  });
}