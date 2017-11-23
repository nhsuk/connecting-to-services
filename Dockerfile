FROM node:8.9.1-alpine as build

RUN apk add --no-cache python=2.7.13-r1 git-perl bash make gcc g++
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
ENV USERNAME nodeuser

RUN adduser -D $USERNAME && \
    mkdir /code && \
    chown $USERNAME:$USERNAME /code

USER $USERNAME
WORKDIR /code

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY yarn.lock package.json /code/

RUN if [ "$NODE_ENV" == "production" ]; then yarn install --production --pure-lockfile; else yarn install --pure-lockfile; fi

COPY . /code

USER root
RUN find /code -user 0 -print0 | xargs -0 chown $USERNAME:$USERNAME
USER $USERNAME

RUN [ "yarn", "brunch-build" ]

FROM node:8.9.1-alpine as release

WORKDIR /code/

COPY --from=build /code/* /code/

EXPOSE 3000

CMD [ "node", "app.js" ]
