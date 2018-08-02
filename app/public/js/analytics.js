((global) => {
  const $ = global.jQuery;
  const hj = global.hj;

  const anchors = {
    openingTimes__openResults: 'OpeningTimes-OpenResults',
  };

  $.each(anchors, (prop, val) => {
    $(`a.${prop}`).on('touchstart click', () => {
      if (typeof hj === 'function') {
        hj('tagRecording', [val]);
      }
      // Webtrends is added asynchronously via DOM manipulation so must be accessed directly
      // rather than setting to a local variable as hj and jQuery are above
      if (global.Webtrends) {
        global.Webtrends.multiTrack({ argsa: ['DCSext.CTSLinkClicks', val, 'WT.dl', '121'] });
      }
    });
  });
})(window);
