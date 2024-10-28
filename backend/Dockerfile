# syntax = docker/dockerfile:1.2
FROM node:20-alpine
#RUN mkdir -p app && chown -R node:node /app
WORKDIR /app
COPY . /app
#USER node
COPY --chown=node:node . .
EXPOSE 8000
#RUN mkdir -p /etc/secrets/ 
#RUN touch /etc/secrets/.env
#RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env

RUN mkdir -p /app/secrets/ 
RUN touch /app/secrets/gcp_auth.json


ARG MONGO_USERNAME 
RUN --mount=type=secret,id=MONGO_USERNAME,required=true \
    export MONGO_USERNAME=$(cat /run/secrets/MONGO_USERNAME)
ARG MONGO_PASSWORD 
RUN --mount=type=secret,id=MONGO_PASSWORD,required=true \
    export MONGO_PASSWORD=$(cat /run/secrets/MONGO_PASSWORD)
ARG GOOGLE_APPLICATION_CREDENTIALS 
RUN --mount=type=secret,id=GOOGLE_APPLICATION_CREDENTIALS,required=true \
    export GOOGLE_APPLICATION_CREDENTIALS=$(cat /run/secrets/GOOGLE_APPLICATION_CREDENTIALS)
ARG GOOGLE_MAPS_API_KEY 
RUN --mount=type=secret,id=GOOGLE_MAPS_API_KEY,required=true \
    export GOOGLE_MAPS_API_KEY=$(cat /run/secrets/GOOGLE_MAPS_API_KEY)

RUN npm install

CMD [ "node", "index.js" ]