(function (global) {
  'use strict';
  var $ = global.jQuery;
  $('details').on('click', function() {
    $(this).toggleClass('open');
    if ($(this).hasClass('open')) {
      $(this).children('summary').attr('aria-expanded','true');
      $(this).children('div.details__content').attr('aria-hidden', 'false');
    } else {
      $(this).children('summary').attr('aria-expanded','false');
      $(this).children('div.details__content').attr('aria-hidden', 'true');
    }
  });
})(window);
