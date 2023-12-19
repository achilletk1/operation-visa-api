# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# https://docs.docker.com/build/building/multi-stage/

FROM node:16-alpine as base

WORKDIR /tmp

# https://stackoverflow.com/questions/69342274/how-to-setup-oracle-instant-client-in-node-alpine-docker
# https://blogs.oracle.com/opal/post/part-1-docker-for-oracle-database-applications-in-nodejs-and-python
# https://blogs.oracle.com/opal/post/dockerfiles-for-node-oracledb-are-easy-and-simple
RUN apk --no-cache add libaio libnsl libc6-compat curl && \
    cd /tmp && \
    curl -o instantclient-basiclite.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip -SL && \
    unzip instantclient-basiclite.zip && \
    mv instantclient*/ /usr/lib/instantclient && \
    rm instantclient-basiclite.zip && \
    ln -s /usr/lib/instantclient/libclntsh.so.19.1 /usr/lib/libclntsh.so && \
    ln -s /usr/lib/instantclient/libocci.so.19.1 /usr/lib/libocci.so && \
    ln -s /usr/lib/instantclient/libociicus.so /usr/lib/libociicus.so && \
    ln -s /usr/lib/instantclient/libnnz19.so /usr/lib/libnnz19.so && \
    ln -s /usr/lib/libnsl.so.2 /usr/lib/libnsl.so.1 && \
    ln -s /lib/libc.so.6 /usr/lib/libresolv.so.2 && \
    ln -s /lib64/ld-linux-x86-64.so.2 /usr/lib/ld-linux-x86-64.so.2

ENV ORACLE_BASE /usr/lib/instantclient
ENV LD_LIBRARY_PATH /usr/lib/instantclient
ENV TNS_ADMIN /usr/lib/instantclient
ENV ORACLE_HOME /usr/lib/instantclient





# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# https://docs.docker.com/build/building/multi-stage/

# FROM node:16-alpine

# COPY package*.json /tmp/

# COPY tsconfig.json /tmp/

# RUN cd /tmp && npm install && npm install copyfiles

# COPY src /tmp/src

# COPY scripts /tmp/scripts

# RUN cd /tmp && npm run build

FROM node:16-alpine as builder

COPY package*.json /tmp/

RUN cd /tmp && npm install && npm install copyfiles

COPY package*.json /tmp/dist/

COPY tsconfig.json /tmp/dist/

COPY scripts /tmp/dist/scripts

COPY src /tmp/dist/src

RUN cd /tmp && npm run copy-files




# FROM node:16-alpine

# COPY package*.json /tmp/

# RUN cd /tmp && npm install --omit=dev --unsafe-perm=true



FROM base as production

RUN mkdir -p /usr/src/ope-visa

COPY --from=builder /tmp/node_modules /usr/src/ope-visa/node_modules

COPY --from=builder /tmp/dist/ /usr/src/ope-visa/

COPY package*.json /usr/src/ope-visa/

# RUN ls -l /usr/src/ope-visa/

WORKDIR  /usr/src/ope-visa

EXPOSE 3000

CMD ["npm", "run", "start:staging-bci"]
