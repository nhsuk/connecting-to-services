0.37.0 / 2018-03-23
===================
- Upgrade to `postcodesio-client@0.3.3`
- Upgrade to `eslint-config-nhsuk@0.13.0` and apply fixes
- Display open results by default for times deemed out of business hours
- Update npm dependencies

0.36.0 / 2018-03-14
===================
- Add newrelic application monitoring
- Update npm dependencies
- Upgrade Docker container to `node:8.10.0-alpine`

0.35.1 / 2018-03-02
===================
- Revert version of performance test script

0.35.0 / N/A
============
- Run performance test with basic auth

0.34.1 / N/A
============
- Responsive design and spacing fixes

0.34.0 / N/A
============
- Upgrade python in Alpine to 2.7.14-r0
- Add on/off toggle for showing open/closed pharmacies

0.33.0 / 2018-02-22
===================
- Add hidden assistive text to meet accessibility standards
- IE bug fix for opening times menu toggle

0.32.0 / 2018-02-20
===================
- Add link to open results page for closed pharmacies
- Move map and services links from below opening times to below address
- Remove unused styles from nearest open results view
- Update npm dependencies
- Misc refactorings

0.31.0 / 2018-02-15
===================
- Additional tests for opening times
- Update npm dependencies
- Prevent start address from appearing in map link for place searches

0.30.0 / 2018-02-06
===================
- Update results page layout to include all opening times
- Include `check` parameter in health check
- Misc refactorings
- Update Google Sitelinks Searchbox query param name

0.29.0 / 2018-02-01
===================
- Add desc metadata to improve description in search engines
- Improve application instrumentation:
  - Add postcodes.io response time monitoring
  - Record bot traffic via `check` query string parameter

0.28.0 / 2018-01-30
===================
- Add metadata to enable Google Sitelinks Searchbox

0.27.0 / 2018-01-25
===================
- Improve browser support for IE6 - 8

0.26.0 / 2018-01-23
===================
- Fix elongated icon in iOS
- Fix no results layout
- Fix breadcrumb for no results page
- Update docker images for `nearby-services-api` used locally and for tests

0.25.0 / 2018-01-18
===================
- Split the display of open and nearby results so they each have a view, toggled via query string parameter `open`
- Revamped results page visuals for open and nearby only views
- Update npm dependencies
- Fixed bug with always pluralised distance message, it will now be singular for 1 mile

0.24.0 / 2018-01-09
===================
- Update styles to fall in line with live styles
- Update npm dependencies
- Correct reference to `GOOGLE_ANALYTICS_TRACKING_ID`
- Add better page titles

0.23.0 / 2017-12-14
===================
- Build `header-items.nunjucks` in Dockerfile
- Display message for upcoming bank holidays
- Return more nearby results
- Display 'call 111' message

0.21.0 / 2017-12-07
===================
- Improve non-English search experience
- Make telephone numbers clickable, using 'tel:'
- Use hosted images

0.20.2 / 2017-11-30
===================
- Fix no open results breadcrumbs

0.20.1 / 2017-11-30
===================
- Move 'none' option out of disambiguation place list
- Move 'back' option out of list
- Update npm dependencies
- Display actual search term when no place or postcodes match

0.20.0 / 2017-11-28
===================
- Fix map link for `your location` searches
- Display correct search field label when no postcode result
- New transitional style header and footer added

0.19.0 / 2017-11-23
===================
- Search by place
- Add 'find my location' search capability
- Add Brunch to minify and compress front-end assets
- Update npm dependencies
- Upgrade Docker container to `node:8.9.1-alpine`
- Support IE7+
- Lint frontend JS

0.18.1 / 2017-11-07
===================
- Update URLs to `/find-a-pharmacy/`

0.17.0 / 2017-11-02
===================
- Link back to pharmacy finder on Choices
- Update page titles
- Update npm dependencies

0.16.0 / 2017-10-31
===================
- Add basic authentication to service when running test environments in Rancher
- Ignore metrics test when running githook as it only works in the container.
- Upgrade Docker container to `node:8.8.1-alpine`
- Update npm dependencies

0.15.0 / 2017-10-17
===================
- Be less specific about third party domains within content security policy
- Performance tests use threshold of 500ms

0.14.0 / 2017-10-11
===================
- Remove smart cache to prevent pharmacy results from being stale.

0.13.0 / 2017-10-10
===================
- Update npm dependencies
- Update `.snyk` policy
- Remove `engine` field from `package.json`
- Exclude subdomains from Strict-Transport-Security header

0.12.1 / 2017-09-13
===================
- Fix date format in CHANGELOG

0.12.0 / 2017-09-12
===================
- Update all npm dependencies
- Upgrade Docker container to node `8.4.0-alpine`
- Add instrumentation to app
- Expose app metrics for Prometheus collection
- Misc back end improvements
- Add CHANGELOG

0.11.0 / 2017-08-18
===================
- Remove alert role from cookie banner

0.10.0 / 2017-08-15
===================
- Removal of artillery performance tests
- Addition of JMeter performance tests
- Addition of `Cache-Control` headers to successful responses

0.9.0 / 2017-08-14
==================
- Send logs to Splunk in JSON
- Update frontend-library version to `0.5.0`
- Update application dependencies
- Encode maps URL

0.8.1 / 2017-07-24
==================
- Fix retina logo on mobile devices
- Fix missing logo in footer

0.8.0 / 2017-07-20
==================
- Update app to use latest version of frontend-library

0.7.0 / 2017-07-13
==================
- Upgrade Docker container to node `8.1.4-alpine`

0.6.0 / 2017-07-10
==================
- Reduce the volume of logs sent to Splunk
- Misc back end improvements

0.5.0 / 2017-07-07
==================
- Migrate app to use frontend-library

< 0.5.0
=======
- Initial work on application
