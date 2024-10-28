# syntax = docker/dockerfile:1.2
FROM node:20-alpine
#RUN mkdir -p app && chown -R node:node /app
WORKDIR /app
COPY . /app
#USER node
COPY --chown=node:node . .
EXPOSE 8000
RUN mkdir -p /etc/secrets/ 
RUN touch /etc/secrets/.env
RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env

RUN --mount=type=secret,id=secret_1 \
    sed -i "s/MONGO_USERNAME=/MONGO_USERNAME=$(cat /run/secrets/MONGO_USERNAME)/" .env.production
RUN --mount=type=secret,id=secret_1 \
    sed -i "s/MONGO_PASSWORD=/MONGO_PASSWORD=$(cat /run/secrets/MONGO_PASSWORD)/" .env.production
RUN --mount=type=secret,id=secret_1 \
    sed -i "s/GOOGLE_APPLICATION_CREDENTIALS=/GOOGLE_APPLICATION_CREDENTIALS=$(cat /run/secrets/GOOGLE_APPLICATION_CREDENTIALS)/" .env.production
RUN --mount=type=secret,id=secret_1 \
    sed -i "s/GOOGLE_MAPS_API_KEY=/GOOGLE_MAPS_API_KEY=$(cat /run/secrets/GOOGLE_MAPS_API_KEY)/" .env.production

RUN npm install

CMD [ "node", "index.js" ]