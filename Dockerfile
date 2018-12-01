
# Dockerfile

#Download base image
FROM node:9-alpine
#Create a NodeJs folder
RUN mkdir /var/www/app
#Update directory   
WORKDIR '/var/www/app'
#Copy
COPY . .