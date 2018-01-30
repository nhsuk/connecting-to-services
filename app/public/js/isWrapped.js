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
  $('details').on('click', function(){
    if(!$(this).is('[open]')){
      $(this).parents('li').addClass('open');
    }
    else {
      $(this).parents('li.open').removeClass('open');
    }
  })
})(window);
