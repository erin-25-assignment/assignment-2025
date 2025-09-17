# 연결 리스트 시각화 (Linked List Visualizer)

이 프로젝트는 연결 리스트(Linked List) 자료구조를 시각적으로 탐색하고 이해할 수 있도록 돕는 인터랙티브 웹 애플리케이션입니다. 사용자는 직접 노드를 추가, 삭제하고 스택(Stack)과 큐(Queue)의 동작 방식을 시뮬레이션하며 데이터의 흐름을 실시간으로 확인할 수 있습니다.

모든 데이터는 서버에 저장되며, 제공되는 API를 통해 누구나 현재 리스트의 데이터를 조회할 수 있습니다.

## ✨ 주요 기능

- **인터랙티브 시각화:** 연결 리스트에 수행하는 모든 작업(추가, 삭제 등)이 실시간으로 화면에 반영됩니다.
- **기본 연산:** 리스트의 머리(head) 또는 꼬리(tail)에 노드를 추가하고, 특정 인덱스의 노드를 조회하거나 삭제할 수 있습니다.
- **스택 (LIFO) 시뮬레이션:** Push (머리에 추가)와 Pop (머리에서 삭제) 연산을 통해 후입선출(Last-In, First-Out) 동작을 시각적으로 학습합니다.
- **큐 (FIFO) 시뮬레이션:** Enqueue (꼬리에 추가)와 Dequeue (머리에서 삭제) 연산을 통해 선입선출(First-In, First-Out) 동작을 시각적으로 학습합니다.
- **데이터 API 제공:** `GET /api/list` 엔드포인트를 통해 현재 연결 리스트의 데이터를 JSON 형식으로 제공합니다.
- **반응형 디자인:** 데스크톱과 모바일 등 다양한 기기에서 편리하게 사용할 수 있습니다.

## 🛠️ 사용된 기술

- **프레임워크:** [Next.js](https://nextjs.org/) (App Router)
- **언어:** [TypeScript](https://www.typescriptlang.org/)
- **UI 라이브러리:** [React](https://react.dev/)
- **스타일링:** [Tailwind CSS](https://tailwindcss.com/)
- **UI 컴포넌트:** [shadcn/ui](https://ui.shadcn.com/)

## 🚀 시작하기

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

1.  **저장소 복제(Clone):**
    ```bash
    git clone <repository-url>
    ```

2.  **프로젝트 폴더로 이동:**
    ```bash
    cd <project-folder>
    ```

3.  **의존성 패키지 설치:**
    ```bash
    npm install
    ```

4.   **Firebase 설정 추가:**

    프로젝트 루트 또는 `src/lib/`에 `firebase.ts` 파일을 생성하고 다음 구조를 따라 입력하세요.  
    민감한 정보(API Key 등)는 각자 Firebase 콘솔에서 발급받아 입력해야 합니다.

    ```ts
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "<YOUR_API_KEY>",
      authDomain: "<YOUR_AUTH_DOMAIN>",
      projectId: "<YOUR_PROJECT_ID>",
      storageBucket: "<YOUR_STORAGE_BUCKET>",
      messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
      appId: "<YOUR_APP_ID>",
      measurementId: "<YOUR_MEASUREMENT_ID>",
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    ```

    ⚠️ `.gitignore`에 `firebase.ts`를 추가하여 깃에 업로드되지 않도록 해야 합니다.

5.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```
    ```

이제 브라우저에서 `http://localhost:3000` (또는 터미널에 안내된 다른 포트)으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 🔗 데이터 API 사용하기

이 애플리케이션은 현재 연결 리스트의 데이터를 외부에서 사용할 수 있도록 API 엔드포인트를 제공합니다.

### `GET /api/list`

현재 리스트의 모든 데이터를 가져옵니다.

**요청 예시 (cURL):**
```bash
curl -X GET <your-app-url>/api/list

Invoke-WebRequest <your-app-url>/api/list
```

**성공 응답 예시:**
```json
{
  "size": 3,
  "data": [
    "10",
    "20",
    "30"
  ]
}
```
