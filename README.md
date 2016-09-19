# Connecting to services

[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services)
[![bitHound Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services/badges/dependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services/badges/devDependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services/master/dependencies/npm)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/connecting-to-services/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/connecting-to-services?branch=master)

A service to help people connect to appropriate NHS services that
meet their time, location and accessibility needs.

## Hosting

There are a number of solutions employed to host the application. The version of
the application linked to from the live website is hosted in Azure, as are the
preview/staging environment.
Every code branch created is automatically built and deployed via Heroku's
[Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps)

* [Live](http://connecting-to-services.azurewebsites.net/)
* [Staging](http://connecting-to-services-staging.azurewebsites.net/)

## Environment variables

Environment variables are loaded by
[dotenv](https://www.npmjs.com/package/dotenv). If the value already
exists within the environment that will be used. If not, the values in a dot
file (`.env`) will be used.
If there is no file, a warning will be issued when the application
attempts to start.

The `.env` file is managed via
[git-submodule](https://git-scm.com/docs/git-submodule). In order to activate
the submodule, once the repo has been cloned the following commands need
to be executed:

```
git submodule init
git submodule update
```

This will clone the submodule into the main repo and update it to the
latest version. Future changes to the submodule can be pulled into the repo
by running the update command.

Using submodules for managing environment variables is only used in developer
environments. Other environments, specifically the hosting environments use
a different mechanism for acquiring environment variables.
