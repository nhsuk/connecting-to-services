# Connecting to services

[![GitHub Release](https://img.shields.io/github/release/nhsuk/connecting-to-services.svg)](https://github.com/nhsuk/connecting-to-services/releases/latest/)
[![Greenkeeper badge](https://badges.greenkeeper.io/nhsuk/connecting-to-services.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/connecting-to-services/badge.svg)](https://snyk.io/test/github/nhsuk/connecting-to-services)

> A service to help people connect to appropriate NHS services that
meet their time, location and accessibility needs.

## Installation

Clone the repo: `git clone https://github.com/nhsuk/connecting-to-services.git`
and review the [`scripts`](scripts) to get up and running.

## Testing

The application uses [Docker](https://www.docker.com/) to run in containers.
Development is typically done on the host machine. Files are loaded into the
container and changes are automatically updated.

Use the `test` script for continuous testing during development.

## Test environments

As the application is being developed, every Pull Request has its own test
environment automatically built and deployed to.

Every environment apart from the one we want the public to access requires
basic authentication to access. The username and password are not secret, in
fact they are included within environment variable table below.
The intention with the authentication challenge is to prevent people whom may
stumble across the site and not realise it is for testing, it also prevents
access by search engines and other bots.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

In order to protect the application from starting up without the required
env vars in place
[require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to check for the env vars that are required for the application to run
successfully.
This happens during the application start-up. If an env var is not found the
application will fail to start and an appropriate message will be displayed.

Environment variables are used to set application level settings for each
environment.

| Variable                           | Description                                                                                   | Default                   | Required   |
| :--------------------------------- | :-------------------------------------------------------------------------------------------- | :------------------------ | ---------- |
| `API_BASE_URL`                     | The fully qualified domain the api exists on e.g. `http://web.site`                           |                           | Yes        |
| `NODE_ENV`                         | Node environment                                                                              | development               |            |
| `LOG_LEVEL`                        | Numeric [log level](https://github.com/trentm/node-bunyan#levels)                             | Depends on `NODE_ENV`     |            |
| `PORT`                             | Server port                                                                                   | 3000                      |            |
| `GOOGLE_ANALYTICS_TRACKING_ID`     | [Google Analytics](https://www.google.co.uk/analytics) property id                            |                           |            |
| `WEBTRENDS_ANALYTICS_TRACKING_ID`  | [Webtrends](https://www.webtrends.com/) tracking id                                           |                           |            |
| `HOTJAR_ANALYTICS_TRACKING_ID`     | [Hotjar](https://www.hotjar.com/) tracking id                                                 |                           |            |
| `BASIC_AUTH`                       | An MD5 encrypted [htpasswd](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html) | test:test                 |            |

## FAQ

* Is the application failing to start?
  * Ensure all expected environment variables are available within the environment
  * If set, `LOG_LEVEL` must be a number and one of the defined [log levels](https://github.com/trentm/node-bunyan#levels)
  * Check for messages in the logs

## Architecture Decision Records

This repo uses
[Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
to record architectural decisions for this project.
They are stored in [doc/adr](doc/adr).
