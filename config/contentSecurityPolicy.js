module.exports = {
  directives: {
    childSrc: [
      '*.hotjar.com',
    ],
    connectSrc: [
      '\'self\'',
      '*.google-analytics.com',
      '*.hotjar.com:*',
      'nhs.funnelback.co.uk',
    ],
    defaultSrc: [
      '\'self\'',
    ],
    fontSrc: [
      '*.hotjar.com',
      '*.nhs.uk',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
      '*.nhs.uk',
    ],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-eval\'',
      '\'unsafe-inline\'',
      'data:',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
    ],
    styleSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      '*.nhs.uk',
    ],
  },
};
