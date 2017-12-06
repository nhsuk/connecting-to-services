const chai = require('chai');
const buildHeaderItems = require('../../../app/lib/header/buildHeaderItems');
const cleanUrl = require('../../../app/lib/header/cleanUrl');
const headerApiResponse = require('../../resources/headerApiResponse');

const expect = chai.expect;

function createMenuItem(title, partUrl, submenus) {
  return {
    Title: title,
    URL: `http://site/${partUrl},${title}`,
    Submenus: submenus
  };
}

describe('cleanUrl', () => {
  it('should replace \'http://site\' with  \'https://www.nhs.uk\' and remove text after comma', () => {
    const title = 'Health A-Z';
    const partUrl = 'Conditions/Pages/hub.aspx';
    const url = `http://site/${partUrl},${title}`;
    const output = cleanUrl(url);
    expect(output).to.equal(`https://www.nhs.uk/${partUrl}`);
  });

  it('should replaces spaces with \'%20\'', () => {
    const output = cleanUrl('http://site/some url');
    expect(output).to.equal('https://www.nhs.uk/some%20url');
  });

  it('should gracefully handle empty urls', () => {
    const output = cleanUrl('');
    expect(output).to.equal('');
  });

  it('should gracefully handle undefined urls', () => {
    const output = cleanUrl(undefined);
    expect(output).to.equal('');
  });
});

describe('buildHeaderItems', () => {
  it('should format list item with no sub menus', () => {
    const title = 'Health A-Z';
    const partUrl = 'Conditions/Pages/hub.aspx';
    const singleMenuItem = [
      {
        Title: title,
        URL: `http://site/${partUrl},${title}`,
      }
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
      createMenuItem(title, partUrl, submenus)
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
    expect(output).to.exist;
  });
});
