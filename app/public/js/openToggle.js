(function (global) {
  'use strict';
  var $ = global.jQuery;
  $('details').on('click', function() {
    $(this).parents('li').toggleClass('open');
  });
})(window);
