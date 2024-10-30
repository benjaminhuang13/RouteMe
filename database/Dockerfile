# syntax = docker/dockerfile:1.2
FROM mongo:latest

# Define mountable directories.
VOLUME ["/data/customer_data"]
# Define working directory.
WORKDIR /data
# Define default command.
CMD ["mongod"]

# Expose ports.
#   - 27017: process
#   - 28017: http
EXPOSE 27017
EXPOSE 28017