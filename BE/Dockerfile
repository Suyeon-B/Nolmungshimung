FROM node:16.16-alpine3.16
RUN apk update
RUN apk add gcompat

RUN apk update
RUN apk add gcompat
RUN mkdir -p /app

WORKDIR "/app"

COPY ./BE .

RUN npm install --force

# COPY . .

EXPOSE 8443 3000 3001 7443

# COPY . .

CMD ["npm","run","start"]
