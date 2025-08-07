import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/gpt', async (req, res) => {
  const { choices } = req.body || [];

  try {
    const prompt = `
당신은 텍스트 어드벤처 게임의 스토리 생성기입니다.
플레이어 선택 기록: ${choices.join(', ')}
다음 스토리를 한 문장으로 써주세요.
그리고 다음 가능한 선택지 2개를 JSON 배열로 주세요.

출력 예시:
{
  "story": "당신은 새로운 방을 발견했다...",
  "choices": ["안으로 들어간다", "도망친다"],
  "isEnding": false
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = completion.choices[0].message?.content || '{}';
    const parsed = JSON.parse(content);

    const imageResponse = await openai.images.generate({
      prompt: `Illustration of: ${parsed.story}`,
      n: 1,
      size: '512x512',
    });

    const imageUrl = imageResponse.data?.[0]?.url || '';

    res.json({
      story: parsed.story,
      choices: parsed.choices,
      image: imageUrl,
      isEnding: parsed.isEnding || false,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'OpenAI API 호출 실패' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});