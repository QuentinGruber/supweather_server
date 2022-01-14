FROM node:16-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 3001
CMD [ "npm", "start" ]
