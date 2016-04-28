
(function($) {
  var DynamicForm = window.DynamicForm || {};

  DynamicForm = (function() {
    function DynamicForm(element, settings) {
      this.defaults = {
        endpoint: '/api/contact',
        method: 'POST'
      };

      this.options = $.extend(true, this.defaults, settings);
      this.$element = $(element);
      this.$html = [];

      this.init();
    }

    return DynamicForm;
  })();

  DynamicForm.prototype.setupDefaultFields = function() {
    this.$html.push('<input name="name" type="text" placeholder="Nome" required />');
    this.$html.push('<input name="email" type="email" placeholder="Email" required />');
  };

  DynamicForm.prototype.setupExtraFields = function() {
    var self = this;
    var fields = this.options.fields;

    $.each(fields, function(key, field) {
      self.buildExtraFields(key, field);
    });
  };

  DynamicForm.prototype.buildExtraFields = function(name, options) {
    var html = [];

    html.push('<select name="' + name + '">');

    $.each(options, function(key, option) {
      html.push('<option value="' + key + '">' + option + '</option>');
    });

    html.push('</select>');
    this.$html.push(html.join(''));
  };

  DynamicForm.prototype.buildForm = function() {
    var html = [];

    html.push('<form>');
    html.push(this.$html.join(''));
    html.push('<input type="submit" />');
    html.push('<span class="message"></span>');
    html.push('</form>');

    this.$element.append(html.join(''));
    this.$element = this.$element.find('form');
  };

  DynamicForm.prototype.attachEvents = function() {
    this.$element.on('submit', this.submit.bind(this));
  };

  DynamicForm.prototype.submit = function(event) {
    event.preventDefault();

    var self = this;
    var $form = self.$element;

    var data = {
      token: self.options.token,
      secret: self.options.secret,
      name: $form.find('input[name="name"]').val(),
      email: $form.find('input[name="email"]').val(),
      state: $form.find('select[name="state"] option:selected').text(),
      level: $form.find('select[name="level"] option:selected').text()
    };

    $.ajax({
      type: self.options.method,
      url: self.options.endpoint,
      data: data,
      success: function(response) {
        $form.find('.message').text(response);
      }
    });

  };

  DynamicForm.prototype.init = function() {
    this.setupDefaultFields();
    this.setupExtraFields();
    this.buildForm();
    this.attachEvents();
  };

  $.fn.dynamicForm = function() {
    var opt = arguments[0] || {};
    var len = this.length;

    for (i = 0; i < len; i++) {
      this[i].dynamicForm = new DynamicForm(this[i], opt);
    }
  }

}(jQuery))


jQuery(document).ready(function($) {
  var options = {
    token: '62bb61431348e22850828a5829c4373faafe29c1',
    secret: '51a266c2844ccd5cac83d88de88d82d05358aa51',
    fields: {
      state: ['PR','SC','SP','RS'],
      level: ['Iniciante','Intermediário','Avançado','Ninja']
    }
  };

  $('.dynamic-form').dynamicForm(options);
});
