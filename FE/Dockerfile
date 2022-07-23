# 노드가 담긴 alpine 이미지 가져오기
FROM node:16.16-alpine3.16

# RUN mkdir -p /app
# 작업할 디렉토리 설정
WORKDIR "/usr/src/app"

# npm install을 캐싱하기 위해 package.json만 따로 카피
COPY package.json ./
COPY yarn.lock ./

RUN npm install --force
RUN yarn
RUN yarn install
 
ENV HOST 0.0.0.0
EXPOSE 3000

# 소스 복사 
COPY . .

# client 소스 실행
CMD ["npm","run","start"]
