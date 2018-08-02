((global) => {
  const document = global.document;

  const searchToggle = {
    doToggle: (e) => {
      e.preventDefault();

      if (searchToggle.searchToggleButton.hasAttribute('aria-expanded')) {
        searchToggle.searchToggleButton.removeAttribute('aria-expanded');
      } else {
        searchToggle.searchToggleButton.setAttribute('aria-expanded', 'true');
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

      toggleClass(searchToggle.searchToggleButton, 'active');
      toggleClass(searchToggle.search, 'js-show');
      toggleClass(searchToggle.menuSearchContainer, 'js-show');
    },
    menuSearchContainer: document.querySelector('.nhsuk-global-header__menusearch'),
    search: document.querySelector('.search-container'),
    searchClose: document.querySelector('.search-close'),
    searchToggleButton: document.querySelector('.search-toggle__button'),
  };

  searchToggle.searchToggleButton.addEventListener('click', (e) => { searchToggle.doToggle(e); });
  searchToggle.searchClose.addEventListener('click', (e) => { searchToggle.doToggle(e); });
})(window);
