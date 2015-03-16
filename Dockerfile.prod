#
# ThisissoonFM Frontend
# Builds a docker image to build and run the production frontend service for thisissoon.fm
#

# Pull node base image
FROM google/nodejs

# Install Nginx
ADD nginx.sources.list /etc/apt/sources.list.d/nginx.list
ADD http://nginx.org/keys/nginx_signing.key /nginx_signing.key
RUN apt-key add /nginx_signing.key && \
    apt-get update -y -q && \
    apt-get install -y -q nginx

# Install global build dependencies
RUN npm install -g grunt-cli bower

# Install app dependencies
WORKDIR /build
ADD package.json /build/package.json
ADD bower.json /build/bower.json
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
