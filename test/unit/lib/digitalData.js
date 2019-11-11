const chai = require('chai');

const siteRoot = require('../../../app/lib/constants').siteRoot;
const digitalData = require('../../../app/lib/digitalData');

const expect = chai.expect;

describe('digitalData', () => {
  // Split siteRoot as it contains 2 paths
  const siteRootPath = siteRoot.substring(1).replace('/', ':');
  const [firstLevelPath, secondLevelPath] = siteRoot.substring(1).split('/');
  const thirdLevelPath = 'third';
  const fourthLevelPath = 'fourth';
  const fifthLevelPath = 'fifth';

  it('should contain 2 categories for site root', () => {
    const req = { path: `${siteRoot}/` };

    const dd = digitalData(req);

    expect(dd).to.not.be.null;
    expect(dd).to.have.property('page');
    expect(dd.page).to.have.property('category');
    expect(dd.page.category).to.have.property('primaryCategory');
    expect(dd.page.category.primaryCategory).to.equal(firstLevelPath);
    expect(dd.page.category).to.have.property('subCategory1');
    expect(dd.page.category.subCategory1).to.equal(secondLevelPath);
    expect(dd.page.category).to.have.property('subCategory2');
    expect(dd.page.category.subCategory2).to.be.undefined;
    expect(dd.page.category).to.have.property('subCategory3');
    expect(dd.page.category.subCategory3).to.be.undefined;
    expect(dd.page).to.have.property('pageInfo');
    expect(dd.page.pageInfo).to.have.property('pageName');
    expect(dd.page.pageInfo.pageName).to.equal(`nhs:beta:${siteRootPath}`);
  });

  it('should contain 3 categories for second level pages', () => {
    const req = { path: `${siteRoot}/${thirdLevelPath}` };

    const dd = digitalData(req);

    expect(dd).to.not.be.null;
    expect(dd).to.have.property('page');
    expect(dd.page).to.have.property('category');
    expect(dd.page.category).to.have.property('primaryCategory');
    expect(dd.page.category.primaryCategory).to.equal(firstLevelPath);
    expect(dd.page.category).to.have.property('subCategory1');
    expect(dd.page.category.subCategory1).to.equal(secondLevelPath);
    expect(dd.page.category).to.have.property('subCategory2');
    expect(dd.page.category.subCategory2).to.equal(thirdLevelPath);
    expect(dd.page.category).to.have.property('subCategory3');
    expect(dd.page.category.subCategory3).to.be.undefined;
    expect(dd.page).to.have.property('pageInfo');
    expect(dd.page.pageInfo).to.have.property('pageName');
    expect(dd.page.pageInfo.pageName).to.equal(`nhs:beta:${siteRootPath}:${thirdLevelPath}`);
  });

  it('should contain 4 categories for third level pages', () => {
    const req = { path: `${siteRoot}/${thirdLevelPath}/${fourthLevelPath}` };

    const dd = digitalData(req);

    expect(dd).to.not.be.null;
    expect(dd).to.have.property('page');
    expect(dd.page).to.have.property('category');
    expect(dd.page.category).to.have.property('primaryCategory');
    expect(dd.page.category.primaryCategory).to.equal('service-search');
    expect(dd.page.category).to.have.property('subCategory1');
    expect(dd.page.category.subCategory1).to.equal('find-a-pharmacy');
    expect(dd.page.category).to.have.property('subCategory2');
    expect(dd.page.category.subCategory2).to.equal(thirdLevelPath);
    expect(dd.page.category).to.have.property('subCategory3');
    expect(dd.page.category.subCategory3).to.equal(fourthLevelPath);
    expect(dd.page).to.have.property('pageInfo');
    expect(dd.page.pageInfo).to.have.property('pageName');
    expect(dd.page.pageInfo.pageName).to.equal(`nhs:beta:${siteRootPath}:${thirdLevelPath}:${fourthLevelPath}`);
  });

  it('should contain 5 categories for fourth level pages', () => {
    const req = { path: `${siteRoot}/${thirdLevelPath}/${fourthLevelPath}/${fifthLevelPath}` };

    const dd = digitalData(req);

    expect(dd).to.not.be.null;
    expect(dd).to.have.property('page');
    expect(dd.page).to.have.property('category');
    expect(dd.page.category).to.have.property('primaryCategory');
    expect(dd.page.category.primaryCategory).to.equal('service-search');
    expect(dd.page.category).to.have.property('subCategory1');
    expect(dd.page.category.subCategory1).to.equal('find-a-pharmacy');
    expect(dd.page.category).to.have.property('subCategory2');
    expect(dd.page.category.subCategory2).to.equal(thirdLevelPath);
    expect(dd.page.category).to.have.property('subCategory3');
    expect(dd.page.category.subCategory3).to.equal(fourthLevelPath);
    expect(dd.page.category).to.have.property('subCategory4');
    expect(dd.page.category.subCategory4).to.equal(fifthLevelPath);
    expect(dd.page).to.have.property('pageInfo');
    expect(dd.page.pageInfo).to.have.property('pageName');
    expect(dd.page.pageInfo.pageName).to.equal(`nhs:beta:${siteRootPath}:${thirdLevelPath}:${fourthLevelPath}:${fifthLevelPath}`);
  });
});
