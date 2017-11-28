(function (global) {
  'use strict';
  var $ = global.jQuery;
  var $search = $('#search');
  var $menuButton = $('#menu-icon');
  var $menu = $('#main-nav');
  $menuButton.on('click', function(e) {
    e.preventDefault();
    $menuButton.toggleClass('menu-icon--open');
    $menu.toggleClass('main-nav--open');

    // measure menu and position search underneath
    var menuHeight = $menu.height();
    $search.css('top', menuHeight);
  });
})(window);
