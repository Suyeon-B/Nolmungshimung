FROM node:16.16-alpine3.16

RUN mkdir -p /app
WORKDIR "/app"

COPY ./package.json ./

RUN npm install -g nodemon \
 && npm install

ENV HOST 0.0.0.0
EXPOSE 8443 3000 3001 7443

COPY . .

CMD ["npm","run","devStart"]