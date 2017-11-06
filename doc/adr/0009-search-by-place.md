# 9. search by place

Date: 2017-11-03

## Status

Accepted

## Context

There is a need to provide the ability for users to search by place name.

## Decision

The postcodes.io places API will be used to search for places in England.

## Consequences

Invalid postcodes will be treated as a place - there will no longer be an 'invalid postcode' warning.
