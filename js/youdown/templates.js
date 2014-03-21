Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div id=\"main\">\n  ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "input", options) : helperMissing.call(depth0, "render", "input", options))));
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("index");
  
});

Ember.TEMPLATES["input"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div id=\"input\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("status")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n  <div class=\"inputstatus\">");
  stack1 = helpers._triageMustache.call(depth0, "video.qualityText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.textField || (depth0 && depth0.textField),options={hash:{
    'id': ("inputurl"),
    'value': ("videoUrl"),
    'disabled': ("processing"),
    'change': ("test"),
    'placeholderKey': ("enter_url"),
    'autofocus': ("autofocus")
  },hashTypes:{'id': "STRING",'value': "ID",'disabled': "ID",'change': "ID",'placeholderKey': "STRING",'autofocus': "STRING"},hashContexts:{'id': depth0,'value': depth0,'disabled': depth0,'change': depth0,'placeholderKey': depth0,'autofocus': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textField", options))));
  data.buffer.push("\n  \n  <div class=\"inputcontrols\">\n    <button class=\"btn btn-danger btn-download\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'disabled': ("inputsDisabled")
  },hashTypes:{'disabled': "STRING"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "download", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">");
  data.buffer.push(escapeExpression((helper = helpers.i18n || (depth0 && depth0.i18n),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "download", options) : helperMissing.call(depth0, "i18n", "download", options))));
  data.buffer.push("</button>\n    \n    <div class=\"inputtarget\">\n      <label for=\"targetSelect\">");
  data.buffer.push(escapeExpression((helper = helpers.i18n || (depth0 && depth0.i18n),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "result", options) : helperMissing.call(depth0, "i18n", "result", options))));
  data.buffer.push("</label>\n      ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'id': ("targetSelect"),
    'disabled': ("inputsDisabled"),
    'contentBinding': ("targets"),
    'optionLabelPath': ("content.displayText"),
    'optionValuePath': ("content.id"),
    'selectionBinding': ("selectedTarget")
  },hashTypes:{'id': "STRING",'disabled': "ID",'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING"},hashContexts:{'id': depth0,'disabled': depth0,'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    </div>\n  </div>\n</div>");
  return buffer;
  
});