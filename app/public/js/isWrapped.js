((global) => {
  const { jQuery: $ } = global;

  $('h2.results__name').each((i, e) => {
    const $this = $(e);
    const $height = $this.height();
    const $lineHeight = Math.floor(parseInt($this.css('line-height').replace('px', ''), 10));
    if ($height > $lineHeight) {
      $this.parents('li').addClass('wrapped');
    }
  });
})(window);
