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

# RUN ls -la > output.txt
# RUN echo "Output of ls:"
# RUN cat output.txt

# RUN ls -la /secrets > output.txt
# RUN echo "Output of ls /secrets:"
# RUN cat output.txt


RUN --mount=type=secret,id=mongo_username,required=true,env=MONGO_USERNAME
RUN --mount=type=secret,id=mongo_password,required=true \
    export MONGO_PASSWORD=$(cat /run/secrets/mongo_password) && \
    echo $MONGO_PASSWORD
RUN --mount=type=secret,id=g_app_cred,required=true \
    export GOOGLE_APPLICATION_CREDENTIALS=$(cat /run/secrets/g_app_cred) && \
    echo $GOOGLE_APPLICATION_CREDENTIALS
RUN --mount=type=secret,id=g_maps_api_key,required=true \
    export GOOGLE_MAPS_API_KEY=$(cat /run/secrets/g_maps_api_key) && \
    echo $GOOGLE_MAPS_API_KEY

RUN npm install

CMD [ "node", "index.js" ]