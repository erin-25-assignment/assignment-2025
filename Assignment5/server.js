import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// === Gemini 초기화 ===
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Unsplash Access Key
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

// === 간단 캐시 (메모리) ===
const cache = new Map(); // key: JSON.stringify(choices), value: {data, ts}
const CACHE_TTL_MS = 1000 * 60 * 5; // 5분

app.post('/api/story', async (req, res) => {
  const choices = Array.isArray(req.body.choices) ? req.body.choices : [];
  const cacheKey = JSON.stringify(choices);

  // 1) 캐시 체크
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    console.log('✅ 캐시 사용:', cacheKey);
    return res.json(cached.data);
  }

  // 2) Gemini 프롬프트
  const prompt = `
당신은 텍스트 어드벤처 게임의 스토리 생성기입니다.
플레이어 선택 기록: ${choices.join(', ')}
다음 스토리를 **한 문장**으로 작성하세요.
그리고 다음 가능한 선택지 2개를 JSON 배열로 출력하세요.
출력 형식(엄격히 JSON):
{
  "story": "한 문장으로 된 스토리 텍스트",
  "choices": ["선택지1", "선택지2"],
  "isEnding": false
}
`;

  try {
    // 3) Gemini 호출
    const result = await model.generateContent(prompt);
    const text = result.response?.text?.() ?? '';

    // 4) JSON 파싱 보정
    let parsed;
    try {
      parsed = JSON.parse(text);
      if (!parsed.story) parsed.story = String(text).split('\n')[0];
      if (!Array.isArray(parsed.choices)) parsed.choices = ['계속한다', '종료한다'];
      if (typeof parsed.isEnding !== 'boolean') parsed.isEnding = false;
    } catch (e) {
      console.warn('⚠️ JSON 파싱 실패, fallback 적용');
      parsed = {
        story: text.split('\n')[0] || '이야기를 불러오지 못했습니다.',
        choices: ['계속한다', '되돌아간다'],
        isEnding: false,
      };
    }

    // 5) Unsplash 이미지 검색
    let imageUrl = '';
    if (UNSPLASH_KEY && parsed.story) {
      const query = encodeURIComponent(parsed.story.split(/[.?!]/)[0].slice(0, 120));
      try {
        const unsplashRes = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${UNSPLASH_KEY}`
        );
        if (unsplashRes.ok) {
          const imgJson = await unsplashRes.json();
          imageUrl = imgJson?.urls?.small || '';
        }
      } catch (err) {
        console.warn('Unsplash 요청 실패:', err);
        imageUrl = '';
      }
    }

    // 6) 최종 응답 데이터
    const responsePayload = {
      story: parsed.story,
      choices: parsed.choices,
      image: imageUrl,
      isEnding: parsed.isEnding,
    };

    // 7) 캐시에 저장
    cache.set(cacheKey, { data: responsePayload, ts: Date.now() });

    return res.json(responsePayload);
  } catch (error) {
    console.error('❌ /api/story 서버 오류:', error);
    return res.status(500).json({ error: '서버에서 스토리를 생성하지 못했습니다.' });
  }
});

// Health 체크
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});


