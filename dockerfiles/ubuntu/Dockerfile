FROM node:7.4
RUN apt-get update && apt-get -y install git

WORKDIR /app

COPY package.json /app

RUN npm config set loglevel warn && npm install

EXPOSE 3000

COPY . /app

CMD [ "npm", "start" ]
