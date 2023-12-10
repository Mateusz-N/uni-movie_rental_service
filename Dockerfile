FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY src/server.js ./src/
COPY public ./public
EXPOSE 8000
CMD ["node", "src/server.js"]
