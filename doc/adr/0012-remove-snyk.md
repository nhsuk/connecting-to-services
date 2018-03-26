# 12. remove snyk

Date: 2018-03-26

## Status

Accepted

## Context

Many of the vulnerabilities identified by snyk have no fixes, and can only be ignored in the synk config file for a set number of days.
After the number of days are up, the vulnerabilities will fail the build and prevent merge on new PRs, with the only option to ignore the
vulnerabilities again.

## Decision

Many of the snyk failures are for build tools that are not exposed when applications are deployed.
The overhead of ignoring many snyk vulnrabilities to get builds passing outweighs the potential risks.
A combination of Greenkeeper ensuring the dependencies are up to date, and subscriptions to vulnerability notofications is
considered sufficient for now, with an automated replacement to be put in place in the near future.

## Consequences

Snyk will not be run as part of the git hooks, or on the CI builds.
