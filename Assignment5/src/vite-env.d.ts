/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  // 필요한 env 변수를 여기 추가 가능
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}