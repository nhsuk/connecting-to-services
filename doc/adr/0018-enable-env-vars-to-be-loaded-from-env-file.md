# 18. Enable environment variables to be loaded from .env file

Date: 2020-01-21

## Status

Accepted

## Context

Sourcing environment variables from a single file deployed along side the
application will simplify the deployment process. Currently the application
runs on Rancher and the deployment is very much the responsibility of the
application. This is likely to change with the advent of the application
running in a Kubernetes cluster. Secrets and deployment are likely to managed
through a more centrally organised system using .env file to source env vars.

## Decision

The decision is to enable the application to source environment variables from
.env files.

## Consequences

Consequences include being able to use .env files for sourcing environment
variables into the application. This will facilitate a more consistent secret
management process.
