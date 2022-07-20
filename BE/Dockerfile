FROM node:16.16-alpine3.16

# RUN mkdir -p /usr/src/app
WORKDIR "/usr/src/app"

COPY ./package.json ./

RUN npm install -g nodemon \
 && npm install --force

ENV HOST 0.0.0.0
EXPOSE 8443 3001 7899 3003

COPY . .

CMD ["npm","run","devStart"]