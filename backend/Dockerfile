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
RUN npm install

CMD [ "node", "index.js" ]