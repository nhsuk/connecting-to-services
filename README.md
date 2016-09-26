# Connecting to services

[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![bitHound Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services/badges/dependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services/badges/devDependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services/master/dependencies/npm)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/connecting-to-services/badge.svg)](https://snyk.io/test/github/nhsuk/connecting-to-services)

A service to help people connect to appropriate NHS services that
meet their time, location and accessibility needs.

## Hosting

There are a number of solutions employed to host the application. The version of
the application linked to from the live website is hosted in Azure, as is the
staging environment.

* [Live](http://connecting-to-services.azurewebsites.net/)
* [Staging](http://connecting-to-services-staging.azurewebsites.net/)

As the application is being developed, every branch of code has its own test
environment automatically built and deployed via Heroku's
[Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps)

The head of `master` is also automatically built and deployed into Heroku.
That is hosted [here](https://connecting-to-services.herokuapp.com/)

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

In order to protect the application from starting up without the required
env vars in place [require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to check all are present as part of the application start-up. If
an env var is not found the application will fail to start and an appropriate
message will be displayed.


## FAQ

* Is the application failing to start?
> Ensure all expected environment variables are available within the environment
