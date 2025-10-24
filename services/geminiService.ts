import { GoogleGenAI, Type, Part } from "@google/genai";
import { Keyword, QuizQuestion, QuizType, StudyMaterial, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface StudyAidsResponse {
  summary: string;
  keywords: Keyword[];
}

const studyAidsSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A comprehensive summary of the material."
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "The key term." },
          definition: { type: Type.STRING, description: "The definition for the term." }
        },
        required: ["term", "definition"]
      }
    }
  },
  required: ["summary", "keywords"]
};


export const generateStudyAids = async (material: StudyMaterial, language: Language): Promise<StudyAidsResponse> => {
  const parts: Part[] = [];
  let systemInstruction = language === 'ko' 
    ? `당신은 전문 학습 보조 AI입니다. 다음 학습 자료를 바탕으로 두 가지 작업을 수행해주세요:
1.  **요약하기:** 핵심 개념과 주요 내용을 담아 간결하고 포괄적인 요약문을 작성하세요.
2.  **핵심 용어 추출:** 가장 중요한 키워드나 전문 용어를 식별하세요. 각 용어에 대해 간단하고 이해하기 쉬운 정의를 제공하세요.

결과는 단일 JSON 객체로 반환해주세요.`
    : `You are an expert learning assistant AI. Please perform two tasks based on the following study material:
1.  **Summarize:** Create a concise and comprehensive summary that captures the core concepts and main points.
2.  **Extract Key Terms:** Identify the most important keywords or technical terms. Provide a simple and easy-to-understand definition for each term.

Return the result as a single JSON object.`;

  if (material.type === 'text') {
      parts.push({ text: `학습 자료:\n---\n${material.content}\n---` });
  } else {
      // For image and audio, content is base64 data
      const base64Data = material.content.split(',')[1];
      parts.push({
          inlineData: {
              mimeType: material.mimeType as string,
              data: base64Data,
          }
      });
      if (material.type === 'image') {
        parts.push({ text: language === 'ko'
          ? `이것은 학습 자료(예: 강의 슬라이드, 교과서 페이지)의 이미지입니다.`
          : `This is an image of study material (e.g., lecture slide, textbook page).`});
      } else if (material.type === 'audio') {
        parts.push({ text: language === 'ko'
          ? `이것은 강의나 학습 세션의 오디오 녹음입니다. 먼저 내용을 받아쓴 다음, 그 내용을 바탕으로 분석해주세요.`
          : `This is an audio recording of a lecture or study session. Please transcribe it first, then analyze the transcription.`});
      }
  }


  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: parts }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: studyAidsSchema,
    }
  });

  const jsonString = response.text.trim();
  return JSON.parse(jsonString) as StudyAidsResponse;
};

export const generateQuiz = async (context: string, type: QuizType, count: number, language: Language, material: StudyMaterial | null): Promise<QuizQuestion[]> => {
    const typeNameEn = type === QuizType.MCQ ? 'Multiple Choice' : type === QuizType.TF ? 'T/F' : 'Short Answer';
    const typeName = language === 'ko' ? type : typeNameEn;

    const getTypeInstruction = (quizType: QuizType, lang: Language): string => {
        const koInstructions = {
            [QuizType.MCQ]: `- "${QuizType.MCQ}"의 경우, 4개의 선택지를 제공하고 정답을 명확히 표시해야 합니다. 질문은 반드시 제공된 자료에 근거해야 합니다.`,
            [QuizType.TF]: `- "${QuizType.TF}"의 경우, 자료에 따라 '참' 또는 '거짓'으로 판단할 수 있는 명제 형식이어야 합니다.`,
            [QuizType.SHORT_ANSWER]: `- "${QuizType.SHORT_ANSWER}"의 경우, 자료에서 찾을 수 있는 간결한 답변을 요구하는 질문이어야 합니다.`,
        };
        const enInstructions = {
            [QuizType.MCQ]: `- For "Multiple Choice", provide 4 options and clearly indicate the correct answer. Questions must be based on the provided material.`,
            [QuizType.TF]: `- For "T/F", the statement should be a proposition that can be judged as 'True' or 'False' based on the material.`,
            [QuizType.SHORT_ANSWER]: `- For "Short Answer", the question should require a concise answer that can be found in the material.`,
        };
        return lang === 'ko' ? koInstructions[quizType] : enInstructions[quizType];
    };

    const specificInstruction = getTypeInstruction(type, language);
    
    let prompt = language === 'ko' ? `당신은 학생들을 위한 전문 퀴즈 제작 AI입니다. 다음 학습 자료를 바탕으로, "${typeName}" 유형의 질문 ${count}개를 포함한 퀴즈를 생성해주세요.

        퀴즈 생성 규칙:
        ${specificInstruction}
        
        각 질문에는 정답과 함께 간결하고 명확한 해설을 포함해야 합니다.

        결과는 반드시 요청된 유형(${typeName})의 질문만 포함하는 JSON 객체 배열로 반환해주세요.

        학습 자료:
        ---
        ${context}
        ---`
        : `You are an expert quiz creation AI for students. Based on the following study material, please generate a quiz with ${count} "${typeName}" type questions.

        Quiz Generation Rule:
        ${specificInstruction}
        
        Each question must include the correct answer and a brief, clear explanation.

        Return the result as a JSON array of objects, containing ONLY questions of the requested type (${typeName}).

        Study Material:
        ---
        ${context}
        ---`;

    const parts: Part[] = [];

    if (material?.type === 'image' && material.mimeType) {
        const base64Data = material.content.split(',')[1];
        parts.push({
            inlineData: {
                mimeType: material.mimeType,
                data: base64Data,
            }
        });

        const imageInstruction = language === 'ko'
            ? ' 또한, 제공된 이미지를 참조하여 시각적 이해를 묻는 질문을 포함시켜주세요.'
            : ' Also, please include questions that refer to the provided image to test visual understanding.';
        
        if (language === 'ko') {
            prompt = prompt.replace('퀴즈를 생성해주세요.', `퀴즈를 생성해주세요.${imageInstruction}`);
        } else {
            prompt = prompt.replace('please generate a quiz', `please generate a quiz.${imageInstruction}`);
        }
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: "The quiz question." },
                        type: {
                            type: Type.STRING,
                            enum: [QuizType.MCQ, QuizType.TF, QuizType.SHORT_ANSWER]
                        },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Array of 4 options for Multiple Choice questions. Empty for other types."
                        },
                        answer: {
                            type: Type.STRING,
                            description: "The correct answer. For MCQ, it must match one of the options. For T/F, it must be 'True' or 'False'."
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "A brief and clear explanation for the correct answer."
                        }
                    },
                    required: ["question", "type", "answer", "explanation"]
                }
            }
        }
    });

    const jsonString = response.text.trim();
    const quiz = JSON.parse(jsonString) as QuizQuestion[];
    return quiz.map(q => {
        if (q.type === QuizType.TF && language === 'ko') {
            if (q.answer.toLowerCase() === 'true' || q.answer === 'o' || q.answer === 'O') {
                q.answer = '참';
            } else if (q.answer.toLowerCase() === 'false' || q.answer === 'x' || q.answer === 'X') {
                q.answer = '거짓';
            }
        }
        return q;
    });
};