const chai = require('chai');
const addBankHolidayMessage = require('../../../app/lib/addBankHolidayMessage');

const { expect } = chai;

describe('addBankHolidayMessage', () => {
  afterEach('reset dateTime override', () => {
    delete process.env.DATETIME;
  });
  it('should return all orgs passed in', () => {
    const orgs = [{ isOpen: true }, { isOpen: true }];

    const alteredOrgs = addBankHolidayMessage(orgs);

    expect(alteredOrgs).to.be.instanceof(Array);
    expect(alteredOrgs.length).to.be.equal(orgs.length);
  });

  it('should add a message to orgs currently open today and today is a bank holiday', () => {
    const todaysDateOverride = '2017-12-25';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: true, nextOpen: '2017-12-25T09:00:00.000Z' }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.equal('Today is a bank holiday. Please call to check opening times.');
  });

  it('should not add a message to orgs currently open today and today is not a bank holiday', () => {
    const todaysDateOverride = '2017-12-24';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: true, nextOpen: '2017-12-25T09:00:00.000Z' }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.undefined;
  });

  it('should not add a message to orgs currently closed today and are next open on a non-bank holiday', () => {
    const todaysDateOverride = '2017-12-24';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: false, nextOpen: '2017-12-27T09:00:00.000Z' }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.undefined;
  });

  it('should add a message to orgs currently closed and are next open on a bank holiday that is today', () => {
    const todaysDateOverride = '2017-12-25';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: false, nextOpen: '2017-12-25T09:00:00.000Z' }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.equal('Today is a bank holiday. Please call to check opening times.');
  });

  it('should add a message to orgs currently closed and are next open on a bank holiday that is tomorrow', () => {
    const todaysDateOverride = '2017-12-24';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: false, nextOpen: '2017-12-25T09:00:00.000Z' }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.equal('Tomorrow is a bank holiday. Please call to check opening times.');
  });

  it('should add a message to orgs currently closed and are next open on a bank holiday that is in 3 days time', () => {
    const todaysDateOverride = '2017-12-22';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: false, nextOpen: '2017-12-25T09:00:00.000Z' }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.equal('Monday is a bank holiday. Please call to check opening times.');
  });

  it('should not add a message to orgs currently closed and have no next open time', () => {
    const todaysDateOverride = '2017-12-22';
    process.env.DATETIME = todaysDateOverride;
    const orgs = [{ isOpen: false, nextOpen: undefined }];

    const alteredOrgs = addBankHolidayMessage(orgs, todaysDateOverride);

    expect(alteredOrgs[0].bankHolidayMessage).to.be.undefined;
  });
});
