FROM --platform=linux/amd64 node:18
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json /opt/app/
RUN yarn
COPY src/ .
EXPOSE 8081
CMD [ "npm", "start"]