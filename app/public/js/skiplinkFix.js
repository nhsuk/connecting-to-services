((global) => {
  const $ = global.jQuery;
  $('.nhsuk-c-skiplink__link').click((event) => {
    event.preventDefault();
    $(':header:first').attr('tabindex', -1).on('blur focusout', (e) => {
      $(e.target).removeAttr('tabindex');
    }).focus();
  });
})(window);
