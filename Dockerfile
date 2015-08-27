#
# ThisissoonFM Frontend
# Builds a docker image to build and run the production frontend service for thisissoon.fm
#

# Pull node base image
FROM mhart/alpine-node:latest

# Install Nginx
RUN apk-install ca-certificates nginx python git

# Install global build dependencies
RUN npm install -g \
    bower \
    grunt-cli

# Install app dependencies
WORKDIR /build
ADD package.json /build/package.json
ADD bower.json /build/bower.json
ADD .bowerrc /build/.bowerrc
RUN npm install --production && \
    bower install --production --allow-root

# Bundle app source
COPY . /build

# Build app
RUN grunt build --env frontend-api && \
    mkdir /fm && \
    mv /build/dist/* /fm

WORKDIR /fm

# Add nginx config - overwrite bundled nginx.conf
COPY nginx.conf /etc/nginx/

# Volumes
VOLUME ["/etc/nginx"]

# Expose ports
EXPOSE 80

CMD nginx
