((global) => {
  const document = global.document;

  const menuToggle = {
    doToggle: (e) => {
      e.preventDefault();

      if (menuToggle.menuToggleButton.hasAttribute('aria-expanded')) {
        menuToggle.menuToggleButton.removeAttribute('aria-expanded');
      } else {
        menuToggle.menuToggleButton.setAttribute('aria-expanded', 'true');
      }

      function toggleClass(ele, class1) {
        const classes = ele.className;
        const regex = new RegExp(`\\b ${class1}\\b`);
        const hasOne = classes.match(regex);
        // eslint-disable-next-line no-param-reassign
        class1 = class1.replace(/\s+/g, '');
        if (hasOne) {
          // eslint-disable-next-line no-param-reassign
          ele.className = classes.replace(regex, '');
        } else {
          // eslint-disable-next-line no-param-reassign
          ele.className = `${classes} ${class1}`;
        }
      }

      toggleClass(menuToggle.menuToggleButton, 'active');
      toggleClass(menuToggle.nav, 'js-show');
    },
    menuClose: document.querySelector('.c-nav-primary__close-link'),
    menuToggleButton: document.querySelector('.menu-toggle__button'),
    nav: document.querySelector('.c-nav-primary'),
  };

  menuToggle.menuToggleButton.addEventListener('click', (e) => { menuToggle.doToggle(e); });
  menuToggle.menuClose.addEventListener('click', (e) => { menuToggle.doToggle(e); });
})(window);
