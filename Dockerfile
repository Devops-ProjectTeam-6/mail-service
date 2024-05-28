#Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["node", "dist/index.js"]