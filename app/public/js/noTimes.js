(function (global) {
  'use strict';
  var $ = global.jQuery;
  $('p.callout--info__mesg:contains("We can\'t find any opening times")').each(function(){
    $(this).parents('li').addClass('noTimes');
  });
})(window);
