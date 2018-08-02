// eslint-disable-next-line no-use-before-define
const NHSUK = NHSUK || {};

NHSUK.headerSearchTypeahead = ((global) => {
  const headerId = '#header';
  const $ = global.jQuery;
  const maxResultCount = 10;
  const searchField = '#q';
  const searchUrl = 'https://www.nhs.uk/search?collection=nhs-meta';
  const suggestUrl = `https://nhs.funnelback.co.uk/s/suggest.json?collection=nhs-meta&partial_query=%QUERY&sort=0&fmt=json++&profile=&show=${maxResultCount}`;
  const suggestions = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('disp'),
    limit: maxResultCount,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: suggestUrl,
      wildcard: '%QUERY',
    },
  });

  function init() {
    suggestions.initialize();

    $(searchField).typeahead({
      classNames: {
        cursor: 'c-search-menu__item--selected',
        dataset: 'c-search-menu__results',
        highlight: '',
        hint: 'c-search__input--shadow',
        menu: 'c-search-menu',
        selectable: 'c-search-menu__item--selectable',
        suggestion: 'c-search-menu__item',
      },
      highlight: true,
      minLength: 2,
    },
    {
      display: 'disp',
      limit: maxResultCount,
      name: '-suggestions',
      source: suggestions.ttAdapter(),
      templates: {
        header: '<li class="c-search-menu__prepend">Search suggestions</li>',
        notFound: '<li class="c-search-menu__nosuggestions">No suggestions</li>',
        suggestion: (data) => {
          let displayitem = '';
          switch (data.disp_t) {
            case 'J':
              $.each(data.disp, (key, value) => {
                displayitem += (key, value);
                displayitem += ' ';
              });
              break;

            default:

              if (data.disp.length > 36) {
                displayitem = `${data.disp.substring(0, 36)}...`;
              } else {
                displayitem = data.disp;
              }
              break;
          }

          const svg = '<svg class="nhsuk-icon nhsuk-icon__search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.71 18.29l-4.11-4.1a7 7 0 1 0-1.41 1.41l4.1 4.11a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 10a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"/><image class="nhsuk-icon__search nhsuk-icon__search--fallback" src="/images/icons/icon-search-blue-20px.png" xlink:href=""></svg>';

          switch (data.action_t) {
            case 'Q':
              displayitem = `<li>${svg}<a href="${searchUrl}&query=${data.action}">${displayitem}</a></li>`;
              break;
            case 'E':
              displayitem = `<li>${svg}<a href="${searchUrl}&query=${data.key}&${data.action}">${displayitem}</a></li>`;
              break;
            case 'U':
              displayitem = `<li>${svg}<a href="${data.action}">${displayitem}</a></li>`;
              break;
            case 'C':
              displayitem = `<li>${svg}<a href="#" onClick="${data.action}">${displayitem}</a></li>`;
              break;
            default:
              displayitem = `<li>${svg}<a href="${searchUrl}&query=${data.disp}">${displayitem}</a></li>`;
              break;
          }

          return displayitem;
        },
      },
    })
      .bind('typeahead:open', () => {
        const val = $(searchField).typeahead('val');
        const value = $(searchField).attr('value');

        if (val === value) {
          $(searchField).typeahead('val', value);
        }
        if (val.toLowerCase() === 'enter a search term') {
          $(searchField).typeahead('val', '');
        }
      })
      .bind('typeahead:render', () => {
        $(`${headerId} .c-search-menu__results`).wrapInner('<ul class="c-search-menu__list"></ul>');
        $(`${headerId} .c-search-menu__list`).css('width', $('.c-search__container').width());
        $(`${headerId} .c-search__input`).addClass('c-search__input--dropdown');
        $(`${headerId} .c-search__submit`).addClass('c-search__submit--dropdown');
        $(`${headerId} .c-search-menu`).insertAfter($('.nhsuk-global-header__search'));

        // calculate where to position the dropdown from the top and left
        const headerheight = $('.nhsuk-global-header__menusearch').height();
        const headerheightmargin = parseInt($('.nhsuk-global-header__search').css('margin-bottom'), 10);
        const topoffset = headerheight - headerheightmargin;
        const position = $(`${headerId} .search-container`).position();

        $(`${headerId} .c-search-menu`).css({
          left: position.left,
          top: topoffset,
        });
      })
      .bind('typeahead:close', () => {
        $(`${headerId} .c-search__input`).removeClass('c-search__input--dropdown');
        $(`${headerId} .c-search__submit`).removeClass('c-search__submit--dropdown');
      });
  }

  return {
    init,
  };
})(window);

$(() => {
  NHSUK.headerSearchTypeahead.init();
  const headerId = '#header';
  // hide the extra input field created by typeahead to screen readers
  $(`${headerId} .c-search__input--shadow`).attr('aria-hidden', 'true').addClass('visually-hidden');
  $(`${headerId} .c-search__input.tt-input`).attr('role', 'textbox');
});
