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


COPY src/upload-folder /usr/src/dbanking/dist/src/upload-folder

COPY src/services/helpers/oauth/schema.proto /usr/src/dbanking/dist/src/services/helpers/oauth/

COPY src/services/helpers/url-crypt/url-crypt.proto /usr/src/dbanking/dist/src/services/helpers/url-crypt/

COPY src/config /usr/src/dbanking/dist/src/config

COPY src/config /usr/src/dbanking/dist/src/config

COPY src/services/helpers/templates /usr/src/dbanking/dist/src/services/helpers/templates

COPY .gitignore /usr/src/dist/dbanking/.gitignore

COPY Dockerfile /usr/src/dist/dbanking/Dockerfile

COPY package*.json /usr/src/dbanking/dist/

COPY scripts /usr/src/dbanking/dist/scripts

COPY tsconfig.json /usr/src/dbanking/dist/tsconfig.json

RUN ls -l /usr/src/dbanking/dist

WORKDIR  /usr/src/dbanking

EXPOSE 3000

CMD ["npm", "run", "start:staging-bci"]

