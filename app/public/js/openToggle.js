((global) => {
  const $ = global.jQuery;
  $('.openingTimes-panel__toggle').on('click', (e) => {
    const $this = $(e.target);
    $this.parent().toggleClass('open');
    if ($this.parent().hasClass('open')) {
      $this.attr('aria-expanded', 'true');
    } else {
      $this.attr('aria-expanded', 'false');
    }
  });
})(window);
