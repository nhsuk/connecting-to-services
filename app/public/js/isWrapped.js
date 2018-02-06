(function (global) {
  'use strict';
  var $ = global.jQuery;
  $('h2.results__name').each(function(){
    var $height = $(this).height();
    var $lineHeight = Math.floor(parseInt($(this).css('line-height').replace('px','')));
    if ($height > $lineHeight){
      $(this).parents('li').addClass('wrapped');
    }
  });
})(window);
