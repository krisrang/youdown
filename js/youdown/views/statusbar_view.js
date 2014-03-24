YouDown.StatusbarView = YouDown.View.extend({
  didInsertElement: function() {
    var self = this,
        chooser = $('#folderchooser');
    
    var controller = this.get('controller');
    
    chooser.change(function(evt) {
      controller.set('saveFolder', $(this).val());
    });
  }
});