YouDown.TextField = Ember.TextField.extend({
  attributeBindings: ['autofocus', 'disabled'],
  
  placeholder: function() {
    if (this.get('placeholderKey')) {
      return i18n.__(this.get('placeholderKey'));
    } else {
      return '';
    }
  }.property('placeholderKey')

});

YouDown.View.registerHelper('textField', YouDown.TextField);