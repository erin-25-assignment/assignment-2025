# 눈 너머의 이야기 (Lost in the Blizzard)

눈 덮인 산장을 배경으로 펼쳐지는 미스터리 인터랙티브 스토리 게임입니다. 플레이어는 구조대원 '리오' 또는 조난자 '세라'가 되어 잃어버린 기억의 조각을 맞추고 숨겨진 진실을 파헤쳐야 합니다. Google의 Genkit과 Gemini AI를 통해 플레이어의 선택에 따라 서사와 이미지가 동적으로 변화하는 독특한 경험을 제공합니다.

## ✨ 주요 기능

- **동적 스토리텔링**: Genkit AI를 활용하여 플레이어의 선택과 캐릭터에 따라 미묘하게 변화하는 서사를 제공하여 높은 몰입감을 선사합니다.
- **AI 이미지 생성**: 각 장면에 맞는 분위기의 이미지를 AI가 실시간으로 생성하여 시각적인 재미를 더합니다.
- **두 명의 주인공, 다른 시점**: 구조대원 '리오'와 조난자 '세라', 각기 다른 시점에서 스토리를 진행하며 진실에 다가갈 수 있습니다.
- **멀티 엔딩**: 플레이어의 여정에 따라 다양한 결말을 맞이하게 됩니다.
- **게임 상태 저장**: 게임 진행 상황이 브라우저의 Local Storage에 자동으로 저장되어 언제든지 이어서 플레이할 수 있습니다.

## 🛠️ 사용된 기술 스택

- **Framework**: Next.js (with App Router)
- **UI**: React, TypeScript, ShadCN/UI, Tailwind CSS
- **Generative AI**: Google Gemini, Genkit

## 🚀 로컬에서 시작하기

이 프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 사전 준비

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- `npm` 또는 `yarn`
- Google Gemini API 키

### 설치 및 실행

1.  **GitHub에서 프로젝트 복제(Clone):**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
    cd YOUR_REPOSITORY
    ```

2.  **필요한 라이브러리(종속성) 설치:**
    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    프로젝트의 루트 디렉터리에 `.env` 파일을 생성하고, 발급받은 Gemini API 키를 추가합니다.
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```

5.  **브라우저에서 확인:**
    웹 브라우저를 열고 `http://localhost:9002` 주소로 접속하면 게임을 시작할 수 있습니다.

## 📁 프로젝트 구조

```
/
├── src/
│   ├── app/                # Next.js App Router 페이지 및 라우팅
│   ├── ai/                 # Genkit AI 흐름(Flows) 및 설정
│   ├── components/         # UI 컴포넌트 (ShadCN/UI 포함)
│   ├── hooks/              # 커스텀 React Hooks
│   └── lib/                # 스토리 데이터, 타입 정의, 유틸리티 함수
├── public/                 # 정적 에셋 (이미지 등)
└── tailwind.config.ts      # Tailwind CSS 설정
```
