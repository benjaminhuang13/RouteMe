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

RUN --mount=type=secret,id=mongo_username,env=MONGO_USERNAME,required=true
RUN --mount=type=secret,id=mongo_password,env=MONGO_PASSWORD,required=true
RUN --mount=type=secret,id=g_app_cred,env=MONGO_USERNAME,required=true
RUN --mount=type=secret,id=g_maps_api_key,env=GOOGLE_MAPS_API_KEY,required=true

RUN npm install

CMD [ "node", "index.js" ]