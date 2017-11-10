0.19.0 / TBD
===================
- Search by place
- Add 'find my location' search capability
- Add Brunch to minify and compress front-end assets
- Update npm dependencies
- Upgrade Docker container to `node:8.8.1-alpine`

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
