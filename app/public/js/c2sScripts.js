(function (global) {
  'use strict';
  $('.viewToggle a').not('.checked').attr('href', function() {
    return this.href + '&open=true';
  });
  $('.viewToggle a.checked').attr('href', function() {
    return this.href = window.location.href.replace(/&open=[^&;]*/,'');
  });
})(window);
