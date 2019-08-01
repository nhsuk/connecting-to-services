const chai = require('chai');
const moment = require('moment');
require('moment-timezone');

const addMessage = require('../../../app/lib/getMessages');
const utils = require('../../../app/lib/utils');

const expect = chai.expect;

describe('addMessage', () => {
  /* eslint-disable sort-keys */
  const alwaysOpenOrg = {
    openingTimes: {
      general: {
        monday: [{ opens: '00:00', closes: '23:59' }],
        tuesday: [{ opens: '00:00', closes: '23:59' }],
        wednesday: [{ opens: '00:00', closes: '23:59' }],
        thursday: [{ opens: '00:00', closes: '23:59' }],
        friday: [{ opens: '00:00', closes: '23:59' }],
        saturday: [{ opens: '00:00', closes: '23:59' }],
        sunday: [{ opens: '00:00', closes: '23:59' }],
      },
    },
  };
  const spanningSundayMidnightOrg = {
    openingTimes: {
      general: {
        monday: [{ opens: '00:00', closes: '20:00' }, { opens: '23:00', closes: '23:59' }],
        tuesday: [{ opens: '00:00', closes: '23:59' }],
        wednesday: [{ opens: '00:00', closes: '23:59' }],
        thursday: [{ opens: '00:00', closes: '23:59' }],
        friday: [{ opens: '00:00', closes: '23:59' }],
        saturday: [{ opens: '00:00', closes: '23:59' }],
        sunday: [{ opens: '10:00', closes: '16:00' }, { opens: '23:00', closes: '23:59' }],
      },
    },
  };
  /* eslint-enable sort-keys */

  it('should return the opening times message, open status and next open', () => {
    const momentString = '2017-01-02 11:00';
    const momentInstance = moment(momentString);
    const nextOpenDateString = momentInstance.format('ddd MMM DD YYYY');

    const openingInfo = addMessage(alwaysOpenOrg.openingTimes, undefined, momentInstance);

    expect(openingInfo.isOpen).to.be.equal(true);
    expect(openingInfo.openingTimesMessage).to.be.equal('Open 24 hours');
    expect(openingInfo.nextOpen).to.not.be.undefined;
    expect(new Date(openingInfo.nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return the opening times message, open status and next open when between 12:00am and 01:00am British Summer Time', () => {
    const justAfterMidnightSundayBST = '2017-10-15T23:00:53.000Z';
    const nextOpenDateString = new Date(justAfterMidnightSundayBST).toDateString();

    // timezone required for correct results
    const momentTime = moment(justAfterMidnightSundayBST).clone().tz('Europe/London');
    const openingInfo = addMessage(spanningSundayMidnightOrg.openingTimes, undefined, momentTime);
    expect(openingInfo.openingTimesMessage).to.be.equal('Open until 8pm today');
    expect(openingInfo.isOpen).to.be.equal(true);
    expect(openingInfo.nextOpen).to.not.be.undefined;
    expect(new Date(openingInfo.nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return the opening times message, open status and next open when before 12:00am British Summer Time', () => {
    const beforeMidnightSundayBST = '2017-10-15T22:00:53.000Z';
    const nextOpenDateString = new Date(beforeMidnightSundayBST).toDateString();

    // timezone required for correct results
    const momentTime = moment(beforeMidnightSundayBST).clone().tz('Europe/London');
    const openingInfo = addMessage(spanningSundayMidnightOrg.openingTimes, undefined, momentTime);
    expect(openingInfo.openingTimesMessage).to.be.equal('Open until 8pm tomorrow');
    expect(openingInfo.isOpen).to.be.equal(true);
    expect(openingInfo.nextOpen).to.not.be.undefined;
    expect(new Date(openingInfo.nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return the opening times message, open status and next open when one minute before 12:00am British Summer Time', () => {
    const justBeforeMidnightSundayBST = '2017-10-15T22:59:00.000Z';
    const nextOpenDateString = new Date(justBeforeMidnightSundayBST).toDateString();

    // timezone required for correct results
    const momentTime = moment(justBeforeMidnightSundayBST).clone().tz('Europe/London');
    const openingInfo = addMessage(spanningSundayMidnightOrg.openingTimes, undefined, momentTime);
    expect(openingInfo.openingTimesMessage).to.be.equal('Open until 8pm tomorrow');
    expect(openingInfo.isOpen).to.be.equal(true);
    expect(openingInfo.nextOpen).to.not.be.undefined;
    expect(new Date(openingInfo.nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should use alterations opening times', () => {
    const momentDate = '2017-03-01';
    const nextOpenDateString = new Date(momentDate).toDateString();
    const nowDate = moment(momentDate).format('YYYY-MM-DD');
    const alterations = {};
    // eslint-disable-next-line sort-keys
    alterations[nowDate] = [{ opens: '00:00', closes: '23:59' }];

    /* eslint-disable sort-keys */
    const orgWithAlterations = {
      openingTimes: {
        alterations,
        general: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
      },
    };
    /* eslint-enable sort-keys */

    const openingInfo = addMessage(orgWithAlterations.openingTimes, undefined, moment(momentDate));

    expect(openingInfo.isOpen).to.be.equal(true);
    expect(openingInfo.openingTimesMessage).to.be.equal('Open until midnight');
    expect(openingInfo.nextOpen).to.not.be.undefined;
    expect(new Date(openingInfo.nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should return nextOpen as the next time open when not already open', () => {
    const momentDate = '2017-03-01';
    const nextOpenDate = '2017-03-02';
    const nextOpenDateString = new Date(nextOpenDate).toDateString();
    const nowDate = moment(momentDate).format('YYYY-MM-DD');
    const alterations = {};
    alterations[nowDate] = [];

    const orgWithAlterations = utils.deepClone(alwaysOpenOrg);
    orgWithAlterations.openingTimes.alterations = alterations;

    const openingInfo = addMessage(orgWithAlterations.openingTimes, undefined, moment(momentDate));

    expect(openingInfo.isOpen).to.be.equal(false);
    expect(openingInfo.openingTimesMessage).to.be.equal('Closed until 12am tomorrow');
    expect(openingInfo.nextOpen).to.not.be.undefined;
    expect(new Date(openingInfo.nextOpen).toDateString()).to.be.equal(nextOpenDateString);
  });

  it('should say call for opening times when the org does not have any opening times but does have phone number', () => {
    const org = {
      contacts: { telephoneNumber: '01234567890' },
      openingTimes: undefined,
    };

    const hasPhoneNumber = org.contacts && org.contacts.telephoneNumber;

    const openingInfo = addMessage(org.openingTimes, hasPhoneNumber);

    expect(openingInfo.isOpen).to.be.equal(false);
    expect(openingInfo.openingTimesMessage).to.be.equal('Call for opening times');
    expect(openingInfo.nextOpen).to.be.undefined;
  });

  it('should say we can\' find any opening times when the org does not have any opening times or a phone number', () => {
    const org = {
      contacts: {},
      openingTimes: undefined,
    };

    const hasPhoneNumber = org.contacts && org.contacts.telephoneNumber;
    const openingInfo = addMessage(org.openingTimes, hasPhoneNumber);

    expect(openingInfo.isOpen).to.be.equal(false);
    expect(openingInfo.openingTimesMessage).to.be.equal('We can\'t find any opening times');
    expect(openingInfo.nextOpen).to.be.undefined;
  });
});
