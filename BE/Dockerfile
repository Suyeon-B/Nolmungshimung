FROM node:16.16-alpine3.16

RUN mkdir -p /app
WORKDIR "/app"

COPY ./BE .

RUN npm install
RUN apk --no-cache update
RUN apk add redis

# COPY . .

EXPOSE 8443 3000 3001 7443

# COPY . .

CMD ["npm","run","start"]
CMD ["redis-server --port 6379"]
