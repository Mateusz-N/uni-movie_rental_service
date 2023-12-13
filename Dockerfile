FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY cert ./cert

ENV PORT=8000
ENV MONGODB_URI = "mongodb://video-rental-database:27017"
ENV SSL_CERT = ${SSL_CERT}
ENV SSL_KEY = ${SSL_KEY}
EXPOSE $PORT

CMD ["node", "src/server.js"]
