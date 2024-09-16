
FROM node:20 AS build

WORKDIR /src

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "build/index.js"]