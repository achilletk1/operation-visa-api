# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# https://docs.docker.com/build/building/multi-stage/

# FROM node:16-alpine

# COPY package*.json /tmp/

# COPY tsconfig.json /tmp/

# RUN cd /tmp && npm install && npm install copyfiles

# COPY src /tmp/src

# COPY scripts /tmp/scripts

# RUN cd /tmp && npm run build

FROM node:16-alpine

RUN cd /tmp && npm install copyfiles

COPY package*.json /tmp/dist/

COPY tsconfig.json /tmp/dist/

COPY scripts /tmp/dist/scripts

COPY src /tmp/dist/src

RUN cd /tmp && npm run copy-files




FROM node:16-alpine

COPY package*.json /tmp/

RUN cd /tmp && npm install --omit=dev --unsafe-perm=true



FROM node:16-alpine

RUN mkdir -p /usr/src/ope-visa

COPY --from=1 /tmp/node_modules /usr/src/ope-visa/node_modules

COPY --from=0 /tmp/dist/ /usr/src/ope-visa/src

COPY package*.json /usr/src/ope-visa/

# RUN ls -l /usr/src/ope-visa/

WORKDIR  /usr/src/ope-visa

EXPOSE 3000

CMD ["npm", "run", "start:staging-bci"]
