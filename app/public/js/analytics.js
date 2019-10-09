((global) => {
  const { hj, jQuery: $ } = global;

  const anchors = {
    openingTimes__openResults: 'OpeningTimes-OpenResults',
  };

  $.each(anchors, (prop, val) => {
    $(`a.${prop}`).on('touchstart click', () => {
      if (typeof hj === 'function') {
        hj('tagRecording', [val]);
      }
    });
  });
})(window);
