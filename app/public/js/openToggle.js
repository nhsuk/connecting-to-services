(function (global) {
  'use strict';
  var $ = global.jQuery;
  $('details').on('click', function() {
    $(this).toggleClass('open');
  });
})(window);
