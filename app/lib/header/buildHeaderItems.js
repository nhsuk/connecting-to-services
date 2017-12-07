const cleanHeaderUrl = require('./cleanHeaderUrl');

const seperator = '';

function getAnchor(item) {
  return `<a href="${cleanHeaderUrl(item.URL)}">${item.Title}</a>`;
}

function getSubmenu(submenus) {
  // eslint-disable-next-line no-use-before-define
  return submenus ? `<ul>${buildLinkTags(submenus)}</ul>` : '';
}

function buildLinkTags(menus) {
  return menus.map(item => `<li>${getAnchor(item)}${getSubmenu(item.Submenus)}</li>`).join(seperator);
}

function buildHeaderItems(menus) {
  return buildLinkTags(menus);
}

module.exports = buildHeaderItems;
