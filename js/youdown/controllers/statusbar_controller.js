YouDown.StatusbarController = Em.ObjectController.extend({ 
  actions: {
    chooseFolder: function(video) {
      $('#folderchooser').click();
    }
  }
});