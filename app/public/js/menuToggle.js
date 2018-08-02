((global) => {
  const $ = global.jQuery;
  const $search = $('#search');
  const $menuButton = $('#menu-icon');
  const $menu = $('#main-nav');

  $menuButton.on('click', (e) => {
    e.preventDefault();
    $menuButton.toggleClass('menu-icon--open');
    $menu.toggleClass('main-nav--open');

    // measure menu and position search underneath
    const menuHeight = $menu.height();
    $search.css('top', menuHeight);
  });
})(window);
