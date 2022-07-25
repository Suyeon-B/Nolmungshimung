FROM node:16.16-alpine3.16

RUN mkdir -p /app
WORKDIR "/app"

COPY ./BE .

RUN npm install
RUN sudo apt-get update
RUN sudo apt-get install -y redis

# COPY . .

EXPOSE 8443 3000 3001 7443

# COPY . .

CMD ["npm","run","start"]
