FROM node:16-alpine

COPY package*.json /tmp/

RUN cd /tmp && npm install --only=production --unsafe-perm=true && npm i -g typescript

COPY tsconfig.json /tmp/

COPY src /tmp/src

COPY scripts /tmp/scripts

RUN cd /tmp && tsc -p .


FROM node:16-alpine

RUN mkdir -p /usr/src/dbanking 

COPY --from=0 /tmp/package*.json /usr/src/dbanking/

COPY --from=0 /tmp/node_modules /usr/src/dbanking/node_modules

COPY --from=0 /tmp/dist /usr/src/dbanking/

COPY src/upload-folder /usr/src/dbanking/src/upload-folder

COPY src/services/helpers/oauth/schema.proto /usr/src/dbanking/dist/src/services/helpers/oauth/

COPY src/services/helpers/url-crypt/url-crypt.proto /usr/src/dbanking/src/services/helpers/url-crypt/

COPY src/config /usr/src/dbanking/src/config

COPY src/config /usr/src/dbanking/src/config

COPY src/services/helpers/templates /usr/src/dbanking/src/services/helpers/templates

COPY .gitignore /usr/src/dbanking/.gitignore

COPY Dockerfile /usr/src/dbanking/Dockerfile

COPY scripts /usr/src/dbanking/scripts

COPY src /usr/src/dbanking/src

COPY tsconfig.json /usr/src/dbanking/tsconfig.json

RUN ls -l /usr/src/dbanking/
RUN ls -l /usr/src/dbanking/# Client App
FROM johnpapa/angular-cli as client-app
LABEL authors="John Papa"
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
COPY . .
RUN ng build --prod

# Node server
FROM node:12-alpine as node-server
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY server.js .
COPY /server /usr/src/app/server

# Final image
FROM node:12-alpine
WORKDIR /usr/src/app
COPY --from=node-server /usr/src /usr/src
COPY --from=client-app /usr/src/app/dist ./
EXPOSE 3000
# CMD ["node", "server.js"]
CMD ["npm", "start"]


WORKDIR  /usr/src/dbanking

EXPOSE 3000

CMD ["npm", "run", "start:staging-bci"]

