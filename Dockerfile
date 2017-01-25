FROM node:7.4-alpine
RUN apk add --no-cache git

WORKDIR /code

ENV NODE_ENV=production

COPY package.json /code

RUN npm install --quiet

COPY . /code

RUN npm run build-css


EXPOSE 3000

CMD [ "npm", "start" ]
