import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { UserSettings } from "../types";

// ─────────────────────────────────────────
// 1) Firebase Config (env에서 값 불러옴)
//    반드시 .env.local (또는 .env)에 넣었어야 함:
//    VITE_FIREBASE_API_KEY=...
//    VITE_FIREBASE_AUTH_DOMAIN=...
//    ...
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// ─────────────────────────────────────────
// 2) Firebase App 초기화 (중복 방지)
// ─────────────────────────────────────────
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ─────────────────────────────────────────
// 3) Export 가능한 인스턴스들
// ─────────────────────────────────────────
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ─────────────────────────────────────────
// 4) Firestore 유저 도큐먼트 경로
//    users/{uid}
// ─────────────────────────────────────────
function userDocRef(uid: string) {
  return doc(db, "users", uid);
}

// ─────────────────────────────────────────
// 5) 기본 UserSettings 생성 헬퍼
//    (App.tsx의 defaultSettings와 일치시켜줘)
// ─────────────────────────────────────────
export function createDefaultUserSettings(
  email: string,
  displayName: string
): UserSettings {
  return {
    theme: "system",
    language: "ko",
    avatar: null,
    displayName,
    // password는 클라이언트 state에서만 쓰는 용도였으니까
    // 서버(DB)에는 굳이 저장 안 해도 됨. (보안상)
  };
}

// ─────────────────────────────────────────
// 6) Firestore에서 UserSettings 가져오기
//    - 없으면 null
// ─────────────────────────────────────────
export async function fetchUserSettings(uid: string): Promise<UserSettings | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  return snap.data() as UserSettings;
}

// ─────────────────────────────────────────
// 7) Firestore에 UserSettings 저장/업데이트
//    - 신규면 setDoc
//    - 기존이면 updateDoc
// ─────────────────────────────────────────
export async function saveUserSettings(uid: string, settings: Partial<UserSettings>) {
  const ref = userDocRef(uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(ref, {
      ...settings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

// ─────────────────────────────────────────
// 8) 이메일/비밀번호 회원가입
//    - Firebase Auth에 계정 생성
//    - displayName 유추해서 profile에 반영
//    - Firestore에 기본 settings 저장
//    - return: { user, settings }
// ─────────────────────────────────────────
export async function signUpWithEmail(email: string, password: string) {
  // 계정 생성
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // displayName을 email 앞부분으로 임시 생성
  const displayNameGuess = email.split("@")[0] || "User";

  // Firebase Auth 프로필에도 displayName 넣기
  await updateProfile(user, {
    displayName: displayNameGuess,
  });

  // Firestore에 기본 설정 저장
  const baseSettings = createDefaultUserSettings(email, displayNameGuess);
  await saveUserSettings(user.uid, baseSettings);

  return {
    user,
    settings: baseSettings,
  };
}

// ─────────────────────────────────────────
// 9) 이메일/비밀번호 로그인
//    - 로그인 성공 시 Firestore settings 로드
// ─────────────────────────────────────────
export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  const settings = await ensureUserSettings(user);

  return { user, settings };
}

// ─────────────────────────────────────────
// 10) 구글 로그인
//     - 처음 로그인하는 유저면 Firestore 세팅 생성
// ─────────────────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;

  const settings = await ensureUserSettings(user);

  return { user, settings };
}

// ─────────────────────────────────────────
// 11) ensureUserSettings
//     - Firestore에 settings 없으면 생성하고
//       있으면 그대로 가져온다.
// ─────────────────────────────────────────
async function ensureUserSettings(user: User): Promise<UserSettings> {
  // 기존 settings 있는지 확인
  let settings = await fetchUserSettings(user.uid);

  if (!settings) {
    // 없으면 기본값 생성해서 저장
    const displayNameGuess =
      user.displayName || user.email?.split("@")[0] || "User";

    const baseSettings = createDefaultUserSettings(
      user.email || "",
      displayNameGuess
    );

    await saveUserSettings(user.uid, baseSettings);
    settings = baseSettings;
  }

  return settings;
}

// ─────────────────────────────────────────
// 12) 로그아웃
// ─────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ─────────────────────────────────────────
// (선택) 계정 삭제 로직
// 실제로 Firebase Auth에서 계정 지우고
// Firestore `users/{uid}`도 지우고 싶다면
// 여기서 deleteDoc 등을 써서 확장 가능.
// ─────────────────────────────────────────
