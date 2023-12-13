FROM node:latest

WORKDIR /usr/src/app

COPY src ./src
COPY public ./public

RUN file="$(ls -R)" && echo $file

COPY package*.json ./
RUN npm install

ENV PORT=8000
EXPOSE $PORT

CMD ["node", "src/server.js"]
