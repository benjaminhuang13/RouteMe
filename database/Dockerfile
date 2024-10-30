# syntax = docker/dockerfile:1.2
FROM mongo:latest

# Define mountable directories.
VOLUME ["/data/customer_data"]
# Define working directory.
WORKDIR /data

RUN --mount=type=secret,id=mongo_username,required=true  \
    export MONGO_USERNAME=$(cat /run/secrets/mongo_username) && \
    echo "MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}" >> /data/.env
RUN --mount=type=secret,id=mongo_password,required=true  \
    export MONGO_PASSWORD=$(cat /run/secrets/mongo_password) && \
    echo "MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}" >> /data/.env

# Define default command.
CMD ["mongod", "--auth", "-f", "/etc/mongod.conf"] 

# Expose ports.
#   - 27017: process
#   - 28017: http
EXPOSE 27017
EXPOSE 28017