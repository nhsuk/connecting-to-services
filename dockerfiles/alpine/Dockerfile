FROM node:alpine
RUN apk add --no-cache git

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD [ "npm", "start" ]
