# 9. search by place

Date: 2017-11-03

## Status

Accepted

## Context

Pharmacies may only be located by postcode or outcode.

## Decision

The postcodes.io places API will be used to search for places in England.

## Consequences

Invalid postcodes will be treated as a place - there will no longer be an 'invalid postcode' warning.
