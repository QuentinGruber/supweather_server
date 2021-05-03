FROM node:16-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm ci
EXPOSE 3001
CMD [ "npm", "start" ]
