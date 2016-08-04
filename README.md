# Connecting to service prototype
[![Build Status](https://travis-ci.org/nhsuk/connecting-to-services-hack-day.svg?branch=master)](https://travis-ci.org/nhsuk/connecting-to-services-hack-day)
[![bitHound Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services-hack-day/badges/dependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services-hack-day/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nhsuk/connecting-to-services-hack-day/badges/devDependencies.svg)](https://www.bithound.io/github/nhsuk/connecting-to-services-hack-day/master/dependencies/npm)

Prototype to see how people react / work with the ability to connect with an
appropriate service directly from a condition/symptom page.

## Environment variables

Environment variables are loaded by the
[dotenv](https://www.npmjs.com/package/dotenv) package. If the value is already
set in the environment it will be used otherwise the values in a dot file (`.env`)
will be used. If there is no file a warning will be issued when the application
starts but it will continue to function.

The `.env` file is managaed by a
[git-submodule](https://git-scm.com/docs/git-submodule). In order to activate
the submodule, once the repo has been cloned the following commands need
to be executed:

```
git submodule init
git submodule update
```

This will clone the submodule repo into the main repo and update it to the
latest version. Future changes to the submodule can be pulled into the repo
by running the update command.

This approach is only used in developer environments. A more robust solution
for ensuring changes to environment variables are propigated through different
environments will be put in place as required.
