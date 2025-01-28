FROM node:20.17.0

WORKDIR /usr/src/index

COPY package*.json ./

RUN npm install --only=production

COPY . .

CMD [ "node", "index.js" ]

EXPOSE 8080