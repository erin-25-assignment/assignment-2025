# 스터디메이트 AI (StudyMate AI)

AI 기반 학습 보조 애플리케이션입니다. 학습 자료(PDF, 이미지, 음성 등)를 업로드하면 AI가 핵심 내용을 요약하고, 주요 키워드를 추출하며, 맞춤형 복습 퀴즈를 생성해 주어 학습 효율을 극대화합니다.

## ✨ 주요 기능

*   **다양한 학습 자료 지원**: PDF, 이미지(JPG, PNG), TXT 파일 및 음성 녹음을 통해 학습 자료를 입력받습니다.
*   **AI 기반 학습 보조 자료 생성**:
    *   **핵심 요약**: 긴 학습 자료의 핵심 내용을 AI가 자동으로 요약합니다.
    *   **주요 키워드 추출**: 중요한 용어와 그에 대한 정의를 목록으로 제공합니다.
*   **맞춤형 AI 퀴즈**:
    *   **다양한 문제 유형**: 객관식, O/X(참/거짓), 단답형 문제를 생성할 수 있습니다.
    *   **문제 수 조절**: 원하는 만큼 문제 수를 설정하여 퀴즈를 풀 수 있습니다.
*   **오답 노트**: 퀴즈에서 틀린 문제들을 자동으로 기록하여 복습을 돕습니다.
*   **Firebase 기반 사용자 인증 및 데이터 저장**:
    *   이메일/비밀번호 및 Google 소셜 로그인을 지원합니다.
    *   사용자별 설정과 오답 노트를 Firestore에 안전하게 저장하고 관리합니다.
*   **사용자 맞춤 설정**:
    *   **테마 설정**: 시스템 설정, 라이트/다크 모드를 지원합니다.
    *   **언어 설정**: 한국어와 영어를 지원합니다.

## 🛠️ 기술 스택

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)
*   **Backend-as-a-Service**: Firebase (Authentication, Firestore)
*   **Library**: `pdf.js`

## 🚀 시작하기 (Getting Started)

이 애플리케이션은 Node.js와 Vite를 기반으로 하는 표준 웹 개발 환경을 사용합니다.

### 사전 요구 사항

*   [Node.js](https://nodejs.org/) (LTS 버전 권장)
*   `npm` (Node.js 설치 시 함께 설치됩니다)

### 설치 및 실행

1.  **저장소 복제 및 이동**:
    ```bash
    git clone <repository-url>
    cd studymate-ai
    ```

2.  **API 키 및 Firebase 설정**:
    프로젝트 루트 경로에 있는 `.env.example` 파일의 복사본을 만들어 `.env` 라는 이름으로 저장하세요.
    ```bash
    cp .env.example .env
    ```
    `.env` 파일을 열고, 각 변수 이름 뒤의 `=` 다음에 오는 `"YOUR_..._KEY"` 부분을 실제 값으로 교체해주세요. **따옴표는 제거하지 마세요.**

    **예시:**
    ```env
    # .env 파일

    # Google Gemini API Key
    # "YOUR_GEMINI_API_KEY" 부분을 실제 API 키로 바꾸세요.
    VITE_GEMINI_API_KEY="AIzaSy...your...actual...key"

    # Firebase Configuration
    # "YOUR_FIREBASE_..." 부분을 Firebase 콘솔에서 복사한 실제 값으로 바꾸세요.
    VITE_FIREBASE_API_KEY="AIzaSy...your...firebase...key"
    VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
    ```

    *   **`VITE_GEMINI_API_KEY`**: [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키를 생성하여 붙여넣습니다.
    *   **Firebase 변수**: [Firebase Console](https://console.firebase.google.com/)에서 웹 앱을 설정할 때 받은 `firebaseConfig` 객체의 값들을 해당하는 변수에 붙여넣습니다.

3.  **Firebase Console 설정**:
    *   **인증 공급자 활성화**: Firebase Console에서 **Authentication** > **Sign-in method** 탭으로 이동하여 **이메일/비밀번호**와 **Google** 공급자를 활성화합니다.
    *   **Firestore 데이터베이스 생성 및 규칙 설정**:
        *   **Firestore Database**로 이동하여 '데이터베이스 만들기'를 클릭합니다.
        *   **프로덕션 모드에서 시작**을 선택하고, 리전을 선택합니다.
        *   **규칙** 탭으로 이동하여 기존 규칙을 다음 내용으로 교체하고 '게시'를 클릭합니다.
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{userId}/{documents=**} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

4.  **패키지 설치**:
    터미널에서 다음 명령어를 실행하여 필요한 모든 패키지를 설치합니다.
    ```bash
    npm install
    ```

5.  **개발 서버 실행**:
    설치가 완료되면, 다음 명령어로 개발 서버를 시작합니다.
    ```bash
    npm run dev
    ```
    터미널에 표시된 로컬 주소(예: `http://localhost:5173`)를 웹 브라우저에서 열어 앱을 확인합니다.

## 📝 사용 방법

1.  **로그인 / 회원가입**: 이메일 또는 Google 계정으로 로그인하거나 새 계정을 만듭니다.
2.  **과목명 입력**: 학습할 과목의 이름을 입력합니다.
3.  **학습 자료 업로드**: PDF, 이미지, TXT 파일을 업로드하거나 마이크를 사용해 강의 내용을 녹음합니다.
4.  **AI 분석 결과 확인**: AI가 생성한 핵심 요약과 주요 키워드를 확인합니다.
5.  **퀴즈 생성**: 원하는 문제 유형(객관식, O/X, 단답형)과 개수를 선택하여 AI 퀴즈를 생성합니다.
6.  **퀴즈 풀이 및 결과 확인**: 생성된 퀴즈를 풀고 점수와 피드백을 확인합니다.
7.  **오답 노트 복습**: 틀린 문제들은 '오답 노트'에 자동으로 저장되며, 언제든지 다시 복습할 수 있습니다.