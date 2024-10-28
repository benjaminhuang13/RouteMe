# syntax = docker/dockerfile:1.2

FROM node:20-alpine
#RUN mkdir -p app && chown -R node:node /app
WORKDIR /app
COPY . /app
#USER node
COPY --chown=node:node . .
EXPOSE 8000

RUN mkdir -p /app/secrets/ 
RUN touch /app/secrets/gcp_auth.json

RUN --mount=type=secret,id=mongo_username,required=true  \
    export MONGO_USERNAME=$(cat /run/secrets/mongo_username) && \
    echo "MONGO_USERNAME=${MONGO_USERNAME}" >> /etc/environment
RUN --mount=type=secret,id=mongo_password,required=true  \
    export MONGO_PASSWORD=$(cat /run/secrets/mongo_password) && \
    echo "MONGO_PASSWORD=${MONGO_PASSWORD}" >> /etc/environment
RUN --mount=type=secret,id=g_app_cred,required=true  \
    export GOOGLE_APPLICATION_CREDENTIALS=$(cat /run/secrets/g_app_cred) && \
    echo "GOOGLE_APPLICATION_CREDENTIALS=${GOOGLE_APPLICATION_CREDENTIALS}" >> /etc/environment
RUN --mount=type=secret,id=g_maps_api_key,required=true  \
    export GOOGLE_MAPS_API_KEY=$(cat /run/secrets/g_maps_api_key) && \
    echo "GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}" >> /etc/environment
RUN --mount=type=secret,id=g_svc_acc_key,required=true  \
    export GOOGLE_SVC_KEY=$(cat /run/secrets/g_svc_acc_key) && \
    echo ${GOOGLE_MAPS_API_KEY} >> /app/secrets/gcp_auth.json 


RUN npm install

CMD [ "node", "index.js" ]