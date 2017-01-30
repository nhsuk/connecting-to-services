FROM node:7.4-alpine
RUN apk add --no-cache git

WORKDIR /code

ARG NODE_ENV=production

ENV NODE_ENV $NODE_ENV

COPY package.json /code

RUN npm install --quiet

EXPOSE 3000

COPY . /code

CMD [ "npm", "start" ]
