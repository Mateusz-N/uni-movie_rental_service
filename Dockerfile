FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY public ./public

ENV PORT=8000
EXPOSE $PORT

CMD ["node", "src/server.js"]
RUN tree -f
