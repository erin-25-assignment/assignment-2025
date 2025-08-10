# AI Story Game

Vite, React, Express를 기반으로 GEMINI API를 활용해 동적인 텍스트 어드벤처 게임을 구현한 프로젝트입니다.  
사용자의 선택에 따라 AI가 새로운 스토리를 생성하고, 이미지도 함께 보여줍니다.

## 주요 기능

- GEMINI GPT 모델을 이용한 스토리 생성  
- 선택지 기반 인터랙티브 스토리 진행  
- AI가 생성한 일러스트 이미지 표시  
- Express 서버에서 GEMINI_API_KEY 요청 처리  
- React 클라이언트에서 Axios로 API 호출 및 UI 렌더링   
- API 호출 결과 캐싱으로 호출 빈도 최적화


## 프로젝트 구조
/assignment5
├── /node_modules
├── /public
├── /src
│   ├──/components
│   │   ├── ChoiceButton.tsx 
│   │   ├── ImageViewer.tsx
│   │   └── StoryView.tsx
│   ├──/pages
│   │   ├── Game.tsx
│   │   └── History.tsx
│   ├──/utils
│   │   └── api.ts
│   ├── vite-env.d.ts
│   ├── App.tsx            # React 메인 컴포넌트
│   └── main.tsx           # React 진입점
├── server.js              # Express 서버 코드
├── package.json
├── vite.config.ts         # Vite 설정 (프록시 포함)
├── .env                   # 환경 변수 (GEMINI_API_KEY)
├── tsconfig.json
├── index.html
├── package-lock.json
└── README.md


---

## 시작하기

### 1. 사전 준비

- Node.js v16 이상 설치  
- GEMINI_API_KEY 키 준비 ([GEMINI_API_KEY 키 발급](https://aistudio.google.com/)
-UNSPLASH_ACCESS_KEY 키 준비([UNSPLASH_ACCESS_KEY 키 발급](https://unsplash.com/)


### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 후 다음 내용 입력:

```env
GEMINI_API_KEY=************************************
UNSPLASH_ACCESS_KEY=************************************

### 3. 의존성 설치 및 실행

npm install          # 의존성 설치
node server.js       # Express 서버 실행 (http://localhost:4000)
npm run dev          # Vite 개발 서버 실행 (http://localhost:5173)

### 4. 실행 순서 (요약)
.env에 GEMINI_API_KEY, UNSPLASH_ACCESS_KEY 넣기

npm install (위 패키지 포함)

터미널 A: npm run start-api (또는 node server.js) — Express 서버(4000)

터미널 B: npm run dev — Vite 개발서버(5173)

브라우저: http://localhost:5173 접속

## 사용법
웹 브라우저에서 http://localhost:5173 에 접속하세요.

게임 시작 시 AI가 만든 스토리와 선택지가 화면에 표시됩니다.

선택지를 클릭해 스토리를 진행하세요.

스토리가 끝나면 새로고침하여 다시 시작할 수 있습니다.

## 주요 기술 및 라이브러리
React, Vite, Express, OpenAI API, Axios

## 주요 코드 설명
server.js: Express 서버에서 API 호출, 스토리 및 이미지 생성 후 클라이언트에 JSON 반환

App.tsx: React 컴포넌트, 선택 내역 관리 및 API 호출, 화면에 스토리와 선택지 렌더링

vite.config.ts: React 개발 서버의 API 요청을 Express 서버로 프록시 처리

## 주요 변경점
OpenAI → Gemini API (@google/generative-ai)

이미지 생성 → Unsplash API 무료 랜덤 이미지

검색어를 스토리 첫 문장 키워드로 자동 생성

AI 이미지보다 품질은 낮지만 무료/제한 적음

JSON 파싱 실패 시 예외 처리 추가

Gemini가 가끔 JSON 포맷을 조금 깨뜨리는 경우 대비