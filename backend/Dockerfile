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

RUN --mount=type=secret,id=mongo_username \
    sed -i "s/MONGO_USERNAME=/MONGO_USERNAME=$(cat /run/secrets/mongo_username)/" .env.production
RUN --mount=type=secret,id=mongo_password \
    sed -i "s/MONGO_PASSWORD=/MONGO_PASSWORD=$(cat /run/secrets/mongo_password)/" .env.production
RUN --mount=type=secret,id=g_app_cred \
    sed -i "s/GOOGLE_APPLICATION_CREDENTIALS=/GOOGLE_APPLICATION_CREDENTIALS=$(cat /run/secrets/g_app_cred)/" .env.production
RUN --mount=type=secret,id=g_maps_api_key \
    sed -i "s/GOOGLE_MAPS_API_KEY=/GOOGLE_MAPS_API_KEY=$(cat /run/secrets/g_maps_api_key)/" secrets/gcp_auth.json


RUN npm install

CMD [ "node", "index.js" ]