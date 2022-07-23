FROM node:16.16-alpine3.16

RUN mkdir -p /app
WORKDIR "/app"

COPY ./BE/. ./

RUN npm install

ENV MONGO_URI "mongodb://localhost:27017/nolshimung"
ENV NODE_TLS_REJECT_UNAUTHORIZED "0"
ENV Redis_IP 3.36.66.43
EXPOSE 8443 3000 3001 7443

# COPY . .

CMD ["npm","run","start"]
