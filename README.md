# Connecting to services

[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/connecting-to-services/badge.svg)](https://snyk.io/test/github/nhsuk/connecting-to-services)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cb52b7957b9748ff8f0d4fbfd12e7de6)](https://www.codacy.com/app/nhsuk/connecting-to-services?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nhsuk/connecting-to-services&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/cb52b7957b9748ff8f0d4fbfd12e7de6)](https://www.codacy.com/app/nhsuk/connecting-to-services?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nhsuk/connecting-to-services&amp;utm_campaign=Badge_Coverage)

A service to help people connect to appropriate NHS services that
meet their time, location and accessibility needs.

## Getting started

Clone the repo: `git clone https://github.com/nhsuk/connecting-to-services.git`

The application uses [Docker](https://www.docker.com/) to run in containers.
Development is done on the host machine. The files are loaded into the
container so the changes are automatically updated.

In order to get this working the application should be started via
`docker-compose up --force-recreate --build`. The application will be available
on [http://localhost:3000](http://localhost:3000) and will auto reload on
changes.

When finished the containers should be stopped via `docker-compose down -v`.
This will ensure the next time they are started they are starting with a
fresh baseline.

### Performance testing

[Artillery](https://artillery.io/docs/#) is available for running performance tests against the application. There are 2 commands:

* `artillery-fire` - runs the tests. The application must be running on port `3000`.
* `artillery-report` - generates a report based on the data saved in `reports/`. Running the test again will overwrite existing reports.

## Test environments

As the application is being developed, every Pull Request has its own test
environment automatically built and deployed to. The PR environments can be
accessed on the internet via `https://<stack_name>-pr-<pr#>.dev.c2s.nhschoices.net`
e.g. `https://connecting-to-services-pr-123.dev.c2s.nhschoices.net`

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

In order to protect the application from starting up without the required
env vars in place [require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to check for the env vars that are required for the application to run
successfully.
This happens during the application start-up. If an env var is not found the
application will fail to start and an appropriate message will be displayed.

Environment variables are used to set application level settings for each
environment.

| Variable                         | Description                                                                            | Default                  | Required        |
|:---------------------------------|:---------------------------------------------------------------------------------------|:-------------------------|-----------------|
| `API_BASE_URL`                   | The fully qualified domain the api exists on e.g. `http://web.site`                    |                          | Yes             |
| `NODE_ENV`                       | node environment                                                                       | development              |                 |
| `PORT`                           | server port                                                                            | 3000                     |                 |
| `GOOGLE_ANALYTICS_TRACKING_ID`   | [Google Analytics](https://www.google.co.uk/analytics) property id                     |                          |                 |
| `WEBTRENDS_ANALYTICS_TRACKING_ID`| [Webtrends](https://www.webtrends.com/) tracking id                                    |                          |                 |
| `HOTJAR_ANALYTICS_TRACKING_ID`   | [Hotjar](https://www.hotjar.com/) tracking id                                          |                          |                 |
| `PHARMACY_LIST_PATH`             | Path to json file containing list of pharmacies                                        | `../data/pharmacy-list`  |                 |

## FAQ

* Is the application failing to start?
  * Ensure all expected environment variables are available within the environment
  * Ensure `LOG_LEVEL` has been set to a valid value
  * Check for messages in the logs
