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

COPY --from=0 /tmp/dist /usr/src/dbanking/dist/

RUN ls -l /usr/src/dbanking/dist/

COPY src/upload-folder /usr/src/dbanking/src/upload-folder

COPY src/services/helpers/oauth/schema.proto /usr/src/dbanking/src/services/helpers/oauth/

COPY src/services/helpers/url-crypt/url-crypt.proto /usr/src/dbanking/src/services/helpers/url-crypt/

COPY src/config /usr/src/dbanking/src/config

COPY src/config /usr/src/dbanking/dist/src/config

COPY src/services/helpers/templates /usr/src/dbanking/src/services/helpers/templates

COPY .gitignore /usr/src/dbanking/.gitignore

COPY Dockerfile /usr/src/dbanking/Dockerfile

COPY package*.json /usr/src/dbanking/

COPY scripts /usr/src/dbanking/scripts

COPY tsconfig.json /usr/src/dbanking/tsconfig.json

RUN ls -l /usr/src/dbanking/

WORKDIR  /usr/src/dbanking

EXPOSE 3000

CMD ["npm", "run", "start:staging-bci"]

