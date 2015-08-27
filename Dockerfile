#
# ThisissoonFM Frontend
# Builds a docker image to build and run the production frontend service for thisissoon.fm
#

# Pull node base image
FROM mhart/alpine-node:latest

# Install Nginx
RUN apk-install ca-certificates nginx python git

# Install global build dependencies
RUN npm install -g grunt-cli bower

# Install app dependencies
WORKDIR /build
ADD package.json /build/package.json
ADD bower.json /build/bower.json
ADD .bowerrc /build/.bowerrc
RUN npm install && \
    bower install --allow-root

# Bundle app source
ADD . /build

# Build app
RUN grunt build --env production && \
    mkdir /fm && \
    mv /build/dist/* /fm

WORKDIR /fm

# Add nginx config - overwrite bundled nginx.conf
ADD nginx.conf /etc/nginx/

# Volumes
VOLUME ["/etc/nginx"]

# Expose ports
EXPOSE 80

CMD nginx
