const fs = require('fs');
const chai = require('chai');
const buildHeaderItems = require('../../../app/lib/header/buildHeaderItems');
const headerApiResponse = require('../../resources/headerApiResponse');

const expect = chai.expect;

function getExpectedHtml() {
  return fs.readFileSync('./test/resources/headerItems.html').toString();
}

function createMenuItem(title, partUrl, submenus) {
  return {
    Submenus: submenus,
    Title: title,
    URL: `http://site/${partUrl},${title}`,
  };
}

describe('buildHeaderItems', () => {
  it('should format list item with no sub menus', () => {
    const title = 'Health A-Z';
    const partUrl = 'Conditions/Pages/hub.aspx';
    const singleMenuItem = [
      {
        Title: title,
        URL: `http://site/${partUrl},${title}`,
      },
    ];
    const output = buildHeaderItems(singleMenuItem);
    expect(output).to.equal(`<li><a href="https://www.nhs.uk/${partUrl}">${title}</a></li>`);
  });

  it('should format submenus  as \'ul\' list items within the top menu', () => {
    const title = 'Health A-Z';
    const partUrl = 'Conditions/Pages/hub.aspx';
    const subMenu1Title = 'Diet and nutrition<span class="hidden"> news reports</span>';
    const subMenu1PartUrl = 'news/pages/newsarticles.aspx?TopicId=Food%2fdiet';
    const subMenu2Title = 'Obesity and weight loss<span class="hidden"> news reports</span>';
    const subMenu2PartUrl = 'news/pages/newsarticles.aspx?TopicId=Obesity';

    const submenus = [
      createMenuItem(subMenu1Title, subMenu1PartUrl),
      createMenuItem(subMenu2Title, subMenu2PartUrl),
    ];

    const singleMenuItem = [
      createMenuItem(title, partUrl, submenus),
    ];
    const output = buildHeaderItems(singleMenuItem);
    const expectedHtml =
      `<li><a href="https://www.nhs.uk/${partUrl}">${title}</a><ul>` +
      `<li><a href="https://www.nhs.uk/${subMenu1PartUrl}">${subMenu1Title}</a></li>` +
      `<li><a href="https://www.nhs.uk/${subMenu2PartUrl}">${subMenu2Title}</a></li>` +
      '</ul></li>';
    expect(output).to.equal(expectedHtml);
  });

  it('should return html for full headerItems response', () => {
    const output = buildHeaderItems(headerApiResponse);
    expect(output).to.equal(getExpectedHtml());
  });
});
