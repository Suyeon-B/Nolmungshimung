# 놀멍 쉬멍 🍊

<br/>

## 1️⃣ 소개
### 친구와 여행을 함께!🏝 제주 여행 계획 플랫폼, 놀멍쉬멍입니다. 😆!!
제작 기간 : 2022.06.30 ~ 2022.08.05

### 1. 잘 짜인 여행코스를 내 계획으로
<img src="https://user-images.githubusercontent.com/78828589/183706032-5ec9a6f3-66e6-4637-a4fd-c1b27940085b.GIF"  width="70%">

### 2. 쉽게 검색해서 추가하고, 친구와 함께 수정하는 계획
<img src="https://user-images.githubusercontent.com/78828589/183706077-41671cef-edb3-4e31-890d-2f9eab389a71.GIF"  width="70%">

### 3. 내 계획을 자랑하고 싶다면, 업로드!
<img src="https://user-images.githubusercontent.com/78828589/183706088-3f71bee1-8ee8-4010-ad6f-b6d2ae6dc50d.GIF"  width="70%">

### 4. 서비스 시연 영상 [⬇️ youtube](https://youtu.be/XEffEqWXxaA)
<a href="https://youtu.be/XEffEqWXxaA" target="_blank"><img src="https://user-images.githubusercontent.com/78828589/184359976-364eeca6-3cc5-4ee7-a2fb-8a8fddd55896.png" title="youtube로 이동" style="width:70%"></a>

<br/>
<br/>

---

<br/>
<br/>

## 2️⃣ 주요 기능

• ✅  음성채팅 ( Peer to Peer )

• ✅  여행 계획 생성 및 수정 

• ✅  여행지 검색, 상세정보 제공

• ✅  여행 경로 동시 편집 ( Drag & Drop )

• ✅  여행 경로 지도에 실시간 반영

• ✅  공유 메모

• ✅  결과 페이지 (모든 여행 경로를 한눈에!)

• ✅  추천 계획 제공

## ➕ 이후 구현 예정 기능

•  🟩  화면 비율에 따라 유저마다 마우스 포인터 위치가 다른 현상 수정

•  🟩  마우스 Drop시 Race Condition 해결

•  🟩  공유 메모 한글 Race Condition 해결

<br/>
<br/>

---

<br/>
<br/>

## 3️⃣ 포스터

<img src="https://user-images.githubusercontent.com/78828589/183707359-a5a1712e-2554-4031-aa69-e7cd80a40b5e.png"  width="80%">

<br/>
<br/>

---

<br/>
<br/>

## 4️⃣ **👩‍💻 API 명세**

No. | Method| URL|기능
:---|:---:|:---|:---
1|POST|/user/signup|회원가입
2|POST|/user/mail|인증메일 전송
3|POST|/user/checkCertificationNumber|인증번호 전송
4|POST|/user/signin|로그인
5|POST|/user/signout|로그아웃
6|POST|/user/auth|권한 검사
7|POST|/user/kakao|카카오 로그인
8|POST|/invite/mail|초대 메일 전송
9|GET|/invite/{token}/{user}|초대 권한 확인
10|POST|/projects|여행계획 추가
11|POST|/projects/upload|추천계획에 공유
12|POST|/projects/title|여행계획 목록 조회
13|PATCH|/projects/routes/{id}|여행경로 수정
14|GET|/projects/{id}| 여행계획 가져오기
15|POST|/projects/{id}|여행계획 삭제
16|PATCH|/projects/{id}|여행계획 수정
17|POST|/projects/friends/{id}|친구 초대
18|GET|/projects/friends/{id}|여행계획에 참여된 인원 조회
19|POST|/projects/memberFriend/{id}|초대된 친구 삭제
20|GET|/projects/memo/{id}|여행계획 메모 조회
21|GET|/recommend/infinite|추천계획 일부 조회
22|GET|/recommend/alldate|추천계획 전체 일정 가져오기
23|POST|/recommend/selectdate|추천계획 선택일정 가져오기
24|GET|/recommend/projects/{id}|추천계획 조회
25|GET|/recommend/hashtag|해쉬태그 관련 프로젝트 조회
26|GET|/recommend/hashtags|해쉬태그 조회
27|POST|/travel/find/{id}|상세 정보 검색

<br/>
<br/>

---
<br/>
<br/>

## 5️⃣ CI/CD
## 사전 준비

- Git
- Node
- MongoDB
- Redis

## **버전**

- Node js Version : 14.15.0
- Redis-server Version : 7.0.3
- MongoDB Version : 6.0
- React Version :

## **Clone and Start the platform**

```
git clone https://github.com/Suyeon-B/Nolmungshimung.git
cd Nolmungshimung
```

## **시작하기**

## BE

#### Install MongoDB

[설치 가이드](https://www.mongodb.com/docs/manual/administration/install-community/)

#### Install Redis

[설치 가이드](https://redis.io/docs/getting-started/installation/)

### **Config**

#### .env 파일 작성

```jsx
cd BE/              // BE 디렉토리 접근하여 .env 파일 생성
```

```jsx
MONGO_URI = ${ 연결할 몽고디비 URI } // mongodb://127.0.0.1:27017
Redis_IP = 127.0.0.1  // redis 설치 경로 - 기본 포트 유지
NODEMAILER_USER = ${ 연결할 이메일 }  // 회원가입, 친구초대 링크를 이메일로 보낼 때 사용
NODEMAILER_PASS = ${ 이메일 비밀번호 }
REACT_APP_GOOGLE_KEY = ${ GoogleMap API Key } // https://developers.google.com/maps/documentation/javascript/get-api-key 발급받아서 사용 - 지도 상세검색
CORS_SERVER_IP= https://localhost:3000 // 프론트엔드 서버 URL
```

#### **Install package & Start Backend**

`npm install` 

`npm start`


## FE

### **Config**

#### .env 파일 작성

```jsx
cd FE/              // FE 디렉토리 접근하여 .env 파일 생성
```

```jsx
REACT_APP_SERVER_IP=localhost // 백엔드 서버 URL - 기본 포트 유지
REACT_APP_GOOGLE_KEY = ${ GoogleMap API Key } // https://developers.google.com/maps/documentation/javascript/get-api-key 발급받아서 사용 - 지도 상세검색
```

#### **Install package & Start Backend**

`npm install —force`

`npm start`

Copyright to [@놀멍쉬멍](https://github.com/Suyeon-B/Nolmungshimung).
