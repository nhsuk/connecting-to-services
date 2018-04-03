(function (global) {
  'use strict';
  var $ = global.jQuery;
  $('.openingTimes-panel__toggle').on('click', function() {
    $(this).parent().toggleClass('open');
    if ($(this).parent().hasClass('open')) {
      $(this).attr('aria-expanded','true');
    } else {
      $(this).attr('aria-expanded','false');
    }
  });
})(window);
