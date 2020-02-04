# Connecting to services

[![GitHub Release](https://img.shields.io/github/release/nhsuk/connecting-to-services.svg)](https://github.com/nhsuk/connecting-to-services/releases/latest/)
[![Greenkeeper badge](https://badges.greenkeeper.io/nhsuk/connecting-to-services.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)

> A service to help people connect to pharmacy services.

## Installation

Clone the repo: `git clone https://github.com/nhsuk/connecting-to-services.git`
and review the [`scripts`](scripts) to get up and running.

## Changing the date and time

The application will display a message for each open pharmacy on a bank holiday.
In order to test this functionality the date can be set when the application
starts. In order to do this the environment variable, `DATETIME` needs to be
set. For example, if the date wanted to be to set to Christmas day 2017 the
following can be run on the command line
`DATETIME=2017-12-25T12:00:00 ./scripts/start`.

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

## BackstopJS tests

There are some BackstopJS UI tests located in [backstop-tests](backstop-tests).
These can be run in Docker using the following instructions:
* From the project root directory run `./scripts/backstop`
* An html report will be generated. It will be accessible at
  `./backstop-tests/backstop_data/html_report/index.html`

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

Environment variables need to be available within the process the application
is running in. This can be done by setting the env vars on the command line or
by adding them to a `.env` file. The `.env` file is excluded from being added
to source control, it is likely to contain sensitive data which should not be
checked in.
A sample `.env` file is available at `.env-sample` with some default settings.
The file can be renamed to `.env` to get started quickly.

| Variable                           | Description                                                                                                                            | Default                                             | Required  |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------           | :-------- |
| `ADOBE_TRACKING_URL`               | [Adobe Analytics](https://www.adobe.com/analytics/adobe-analytics.html) Dynamic Tag Management URL                                     |                                                     | No        |
| `BACKSTOP_TEST_URL`                | The fully qualified domain against which the BackstopJS UI tests will be run e.g. `http://beta.nhs.uk`                                 | http://beta.nhs.uk                                  | Yes       |
| `BASIC_AUTH`                       | An MD5 encrypted [htpasswd](https://httpd.apache.org/docs/2.4/misc/password_encryptions.html)                                          | See value set in Vault for `BASIC_AUTH` in defaults |           |
| `BUSINESS_HOURS_START_HOUR`        | Business hours start hour                                                                                                              | 8                                                   | No        |
| `BUSINESS_HOURS_START_MINUTE`      | Business hours start minute                                                                                                            | 0                                                   | No        |
| `BUSINESS_HOURS_END_HOUR`          | Business hours end hour                                                                                                                | 18                                                  | No        |
| `BUSINESS_HOURS_END_MINUTE`        | Business hours end minute                                                                                                              | 0                                                   | No        |
| `COOKIEBOT_SCRIPT_URL`             | The URL for the in-house implementation of Cookiebot                                                                                   | //assets.nhs.uk/scripts/cookie-consent.js           |           |
| `DOTENV_PATH`                      | The path to the `.env` file containing the environment variables for the application                                                   | `.env`                                              | No        |
| `DATETIME`                         | The initial display of results is determined by the time of the search. Bank holiday messaging is determined by the date of the search |                                                     | No        |
| `HOTJAR_ANALYTICS_TRACKING_ID`     | [Hotjar](https://www.hotjar.com/) tracking id                                                                                          |                                                     | No        |
| `LOG_LEVEL`                        | Numeric [log level](https://github.com/trentm/node-bunyan#levels)                                                                      | Depends on `NODE_ENV`                               |           |
| `NODE_ENV`                         | Node environment                                                                                                                       | development                                         |           |
| `PORT`                             | Server port                                                                                                                            | 3000                                                |           |
| `SEARCH_API_HOST`                  | Hostname for Organisation Search API                                                                                                   | api.nhs.uk                                          | No        |
| `SEARCH_API_KEY `                  | Access key for Organisation Search API                                                                                                 |                                                     | Yes       |
| `SEARCH_API_VERSION`               | Organisation Search API version number                                                                                                 | 1                                                   | No        |

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
