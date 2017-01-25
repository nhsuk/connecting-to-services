FROM node:7.4-alpine
RUN apk add --no-cache git

WORKDIR /app

ENV NODE_ENV=production
#ENV NODE_ENV=development # for debuggin purposes

COPY package.json /app

RUN npm install --quiet
#RUN npm install -g nodemon # for debuggin purposes

EXPOSE 3000

COPY . /app

CMD [ "npm", "start" ]
