#
# ThisissoonFM Frontend
# Builds a docker image to run the production frontend service for thisissoon.fm
#

# Pull alpine base image
FROM nginx:1.10.3-alpine

# Bundle app build
COPY ./dist /fm

# Working Dir
WORKDIR /fm

# Add nginx config - overwrite bundled nginx.conf
COPY nginx.conf /etc/nginx/

# Volumes
VOLUME ["/etc/nginx"]

# Expose ports
EXPOSE 80

CMD nginx
