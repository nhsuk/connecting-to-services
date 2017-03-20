# Connecting to services

[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/connecting-to-services/badge.svg)](https://snyk.io/test/github/nhsuk/connecting-to-services)

A service to help people connect to appropriate NHS services that
meet their time, location and accessibility needs.

## Getting started

Clone the repo: `git clone https://github.com/nhsuk/connecting-to-services.git`

Change directory to where the repo was cloned and install dependencies:
`cd ./connecting-to-services/ && npm install`

If running the app on your local machine you will need to regenerate the CSS by
running `npm run build-css-dev`.  CSS generation happens as part of the Docker
image creation and also when running locally using the Docker development
environment with file watching and so the step isn't required in those
situations.

### Run the app

In order to get the application running, execute `API_BASE_URL=${apiUrl} npm
run watch-dev` where `${apiUrl}` is the url of the api being used to retrieve
nearby services.  The api will be a version of
[`nhsuk/nearby-services-api`](https://github.com/nhsuk/nearby-services-api).
Any instance of the api can be used, typically it would be the staging instance
but it might be a local version if changes are being made to the API at the
same time. If the local version of the API is being used `${apiUrl}` would be
http://localhost:3001 which gives the full command to run as:
`API_BASE_URL=http://localhost:3001 npm run watch-dev`.

The npm script `watch-dev` uses [nodemon](https://nodemon.io/) to auto reload
the site when changes are made.

## Testing

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

[Artillery](https://artillery.io/docs/#) is available for running performance
tests against the application. There are 2 commands:

* `artillery-fire` - runs the tests. The application must be running on port
  `3000`.
* `artillery-report` - generates a report based on the data saved in
  `reports/`. Running the test again will overwrite existing reports.

## Test environments

As the application is being developed, every Pull Request has its own test
environment automatically built and deployed to. The PR environments can be
accessed on the internet via
`https://<stack_name>-pr-<pr#>.dev.c2s.nhschoices.net` e.g.
`https://connecting-to-services-pr-123.dev.c2s.nhschoices.net`

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
