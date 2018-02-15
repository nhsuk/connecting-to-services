(function(global) {
  'use strict';
  var $ = global.jQuery;
  var hj = global.hj;

  var anchors = {
    'openingTimes__openResults' : 'OpeningTimes-OpenResults',
  }

  $.each(anchors , function(prop, val) {
    $('a.' + prop).on('touchstart click', function () {
      if (typeof hj === 'function') {
        hj('tagRecording', [val]);
      }
      // Webtrends is added asynchronously via DOM manipulation so must be accessed directly
      // rather than setting to a local variable as hj and jQuery are above
      if (global.Webtrends) {
        global.Webtrends.multiTrack({argsa: ['DCSext.CTSLinkClicks', val, 'WT.dl', '121']});
      }
    });
  });
})(window);
