(function (global) {
  'use strict';
  var $ = global.jQuery;
  var window = global;
  $('.viewToggle a').not('.checked').attr('href', function() {
    return this.href + '&open=true';
  });
  $('.viewToggle a.checked').attr('href', function() {
    return this.href = window.location.href.replace(/&open=[^&;]*/,'');
  });
})(window);
