Ember.Handlebars.registerHelper('i18n', function(property, options) {
  // Resolve any properties
  var params = options.hash,
      self = this;
      
  property = property.toString();

  _.each(params, function(value, key) {
    params[key] = Em.Handlebars.get(self, value, options);
  });

  return i18n.__(property, params);
});

Ember.Handlebars.registerBoundHelper("boundI18n", function(property, options) {
  return new Handlebars.SafeString(i18n.__(property, options.hash));
});