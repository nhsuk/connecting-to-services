FROM node:7.4-alpine
RUN apk add --no-cache git

WORKDIR /app

COPY package.json /app

RUN npm install

EXPOSE 3001

COPY . /app

CMD [ "npm", "start" ]
