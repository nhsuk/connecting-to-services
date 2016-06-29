# gp-to-services
[![Build Status](https://travis-ci.org/nhsalpha/gp-to-services.svg?branch=master)](https://travis-ci.org/nhsalpha/gp-to-services)
[![Coverage Status](https://coveralls.io/repos/github/nhsalpha/gp-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsalpha/gp-to-services?branch=master)
[![bitHound Dependencies](https://www.bithound.io/github/nhsalpha/gp-to-services/badges/dependencies.svg)](https://www.bithound.io/github/nhsalpha/gp-to-services/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nhsalpha/gp-to-services/badges/devDependencies.svg)](https://www.bithound.io/github/nhsalpha/gp-to-services/master/dependencies/npm)

Connecting the user journey from GP details to services

## Environment variables

Environment variables are loaded by the
[dotenv](https://www.npmjs.com/package/dotenv) package. If the value is already
set in the environment it will be used otherwise the values in a dot file (.env)
will be used. If there is no file a warning will be issued when the application
starts but it will continue to function.

The .env file should be created in the root of the project and is ignored by git.

It is anticipated that the .env file approach to environment variables will be used only in development environments.
