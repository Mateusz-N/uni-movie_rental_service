FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src/server.js ./src/
COPY public ./public

ENV PORT=8000
EXPOSE $PORT

CMD ["node", "src/server.js"]
