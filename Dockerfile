#
# ThisissoonFM Frontend
# Builds a docker image to run the production frontend service for thisissoon.fm
#

# Pull alpine base image
FROM alpine:3.2

# Install Nginx
RUN apk add --update nginx && \
    rm -rf /var/cache/apk/*

# Bundle app build
COPY ./dist /fm

WORKDIR /fm

# Add nginx config - overwrite bundled nginx.conf
COPY nginx.conf /etc/nginx/

# Volumes
VOLUME ["/etc/nginx"]

# Expose ports
EXPOSE 80

CMD nginx
