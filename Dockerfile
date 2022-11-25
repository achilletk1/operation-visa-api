FROM node:16-alpine

COPY package*.json /tmp/

RUN cd /tmp && npm install --only=production --unsafe-perm=true && npm i -g typescript

COPY tsconfig.json /tmp/

COPY src /tmp/src

COPY scripts /tmp/scripts

RUN cd /tmp && tsc -p .



FROM node:16-alpine

ENV NODE_PATH=/usr/lib/node_modules

COPY package.json /tmp/package.json

RUN cd /tmp && npm install --only=production --unsafe-perm=true && npm i -g typescript

RUN mkdir -p /usr/src/dbanking && cp -a /tmp/node_modules /usr/src/dbanking/

WORKDIR /usr/src/dbanking



COPY tsconfig.json /usr/src/dbanking/tsconfig.json

COPY dist /usr/src/dbanking/dist


COPY src/services/helpers/oauth/schema.proto /usr/src/dbanking/dist/src/services/helpers/oauth/

COPY src/services/helpers/url-crypt/url-crypt.proto /usr/src/dbanking/dist/src/services/helpers/url-crypt/

COPY src/config /usr/src/dbanking/dist/src/config

COPY src/services/helpers/templates /usr/src/dbanking/dist/src/services/helpers/templates

COPY .gitignore /usr/src/dbanking/.gitignore

COPY Dockerfile /usr/src/dbanking/Dockerfile

COPY package*.json /usr/src/dbanking/

COPY scripts /usr/src/dbanking/scripts

COPY tsconfig.json /usr/src/dbanking/tsconfig.json


COPY src/config /usr/src/dbanking/dist/config


# RUN NODE_ENV=staging-bci
CMD npm run start:staging

