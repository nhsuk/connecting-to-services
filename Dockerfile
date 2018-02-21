FROM node:8.9.1-alpine

# Notes:

# COPY does not handle ENV expansion so not using an env for username
#   Trade-off between DRY and minimising the number of layers
# WORKDIR will create a directory if it doesn't exist but with the wrong permissions
#   https://github.com/moby/moby/issues/20295
# The COPY of the build context will be masked in dev by the bind mount
#   It would be good to have a conditional to skip the COPY if a
#   a bind mount exists but docker doesn't support it.

RUN \
  apk add --no-cache python=2.7.13-r1 git-perl bash make gcc g++ && \
  ln -fs /bin/bash /bin/sh && \
  adduser -D nodeuser && \
  mkdir /code && \
  chown nodeuser:nodeuser /code

USER nodeuser
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /code

COPY --chown=nodeuser:nodeuser yarn.lock package.json /code/ 

RUN if [ "$NODE_ENV" == "production" ]; then yarn install --production --pure-lockfile; else yarn install --pure-lockfile; fi

# .dockerignore prevents unneeded files from being copied
COPY --chown=nodeuser:nodeuser . . 

RUN [ "yarn", "header-build" ]
RUN [ "yarn", "brunch-build" ]


EXPOSE 3000
# RUN APP DIRECTLY TO AVOID SPAWNING SUBPROCESSES IN DOCKER
CMD [ "node", "app.js" ]
