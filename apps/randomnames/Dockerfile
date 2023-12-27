FROM node:18.16.0-alpine3.17
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./package.json /usr/app
RUN yarn
COPY ./index.js /usr/app

EXPOSE 8082
CMD ["node", "index.js"]