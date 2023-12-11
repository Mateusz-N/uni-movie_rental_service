#!/bin/bash

# Pull the latest Docker image from DockerHub
docker pull matnos/uni-movie_rental_service:latest
docker pull matnos/uni-movie_rental_database:latest

# Stop and remove the existing container (if running)
docker stop wypozyczalnia-wideo-aplikacja
docker rm wypozyczalnia-wideo-aplikacja

# Stop and remove the existing container (if running)
docker stop wypozyczalnia-wideo-baza
docker rm wypozyczalnia-wideo-baza

# Run the database Docker container
docker run -d -p 27017:27017 --name wypozyczalnia-wideo-baza
  matnos/uni-movie_rental_database:latest

# Run the app Docker container
docker run -d -p 8000:8000 --name wypozyczalnia-wideo-aplikacja \
  -e MONGO_DB_URL=$MONGO_DB_URL \
  -e PORT=$PORT \
  -e SSL_CERT=$SSL_CERT \
  -e SSL_KEY=$SSL_KEY \
  matnos/uni-movie_rental_service:latest