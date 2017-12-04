const siteToReplace = 'http://site';
const nhsukDomain = 'https://www.nhs.uk';
const seperator = '';

function getUrl(item) {
  return item.URL.split(',')[0].replace(siteToReplace, nhsukDomain).replace(/ /g, '%20');
}

function getAnchor(item) {
  return `<a href="${getUrl(item)}">${item.Title}</a>`;
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
