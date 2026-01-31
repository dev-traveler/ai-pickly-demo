// services/analyzer.ts - AI content analysis service using Gemini

import axios from "axios";
import {
  AIAnalysisResult,
  Difficulty,
  Language,
  TimeType,
  PreviewType
} from "../types/index.js";
import {
  AI_TOOLS_COMMON,
  KOREAN_CHARS_PER_MINUTE,
  ENGLISH_WORDS_PER_MINUTE
} from "../constants.js";

// Analyze content using Gemini API
export async function analyzeContent(
  title: string,
  content: string,
  url: string,
  duration?: number,
  wordCount?: number
): Promise<AIAnalysisResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  
  // Prepare analysis prompt - PRD Version 2.0
  const analysisPrompt = `당신은 AI 콘텐츠 분석 전문 에디터입니다. 다음 콘텐츠를 분석하여 정확한 메타데이터를 생성해주세요.

제목: ${title}
URL: ${url}
내용:
${content.substring(0, 3000)}

[필드별 상세 조건]

1. **category** (콘텐츠의 형식이 아닌 내용을 기준으로 분류, 다음 4가지 중 하나만 선택):
   - "text": 텍스트 생성, 글쓰기, 문서 작성 관련
   - "image": 이미지 생성, 디자인, 시각 콘텐츠 관련
   - "video": 영상 생성, 편집, 동영상 콘텐츠 관련
   - "code": 프로그래밍, 코딩, 개발 관련

2. **ai_tools** (콘텐츠에서 사용된 AI 도구들):
   - 모든 이름은 띄어쓰기 없이 무조건 소문자로 모두 붙여서 작성
   - 예: ["chatgpt", "midjourney", "perplexitylabs", "gpt4o", "claudeai"]
   - 일반적인 도구들: ${AI_TOOLS_COMMON.join(", ")}

3. **rn_time** (소요 시간):
   - 영상일 경우: 영상의 길이를 HH:MM:SS 형식으로 작성
   - 텍스트일 경우: UI 텍스트 제외 본문만 계산
     - 한국어: 공백 포함 글자 수 숫자만 기입
     - 영어: 단어 수(Word count) 숫자만 기입

4. **description** (친절하고 동기부여를 주는 에디터 스타일):
   - 문장 끝맺음: 모든 문장은 무조건 "~에요/아요" 체로 끝내기
   - 1-2문장 이내로 작성:
     - 1문장: 에디터가 해당 콘텐츠를 직접 보고 간단하게 소개하는 문장 (너무 짧지 않게)
     - 마지막 문장: 구독자의 행동 유도(CTA)

5. **tags** (콘텐츠를 설명하는 키워드, 3-7개):
   - 첫 번째 태그: 직무 관점에서 콘텐츠를 가장 잘 표현하는 태그
   - 모든 태그는 # 기호를 붙여야 함
   - 모든 태그는 중복되지 않아야 함 (배열 내에서 각 태그는 유니크해야 함)
   - 예: ["#개발자", "#AI활용", "#자동화", "#ChatGPT"]

6. **level** (난이도, 영문으로):
   - "beginner": 복사/붙여넣기로 따라 할 수 있는 경우
   - "intermediate": 프롬프트 작성 또는 수정이 필요한 경우
   - "advanced": 프로그램 설치 및 코딩이 필요한 경우

7. **language**:
   - 메인 언어가 한국어면 "ko", 영어면 "en"

8. **result_preview** (실용적 예시):
   - 문장 끝맺음: 모든 문장은 무조건 "~에요" 체로 끝내기
   - 콘텐츠를 통해 할 수 있는 실용적인 작업을 짧은 4문장으로 정리하여 배열에 담기
   - 예: ["이메일 답장을 작성할 수 있어요", "회의록을 요약할 수 있어요", "보고서를 생성할 수 있어요", "아이디어를 브레인스토밍할 수 있어요"]

정확히 다음 JSON 형식으로만 응답해주세요 (다른 설명 없이):
{
  "category": "text|image|video|code",
  "ai_tools": ["chatgpt", "midjourney"],
  "rn_time": "00:10:30 또는 1500",
  "description": "~에요/아요체 설명",
  "tags": ["#직무태그", "#태그2"],
  "level": "beginner|intermediate|advanced",
  "language": "ko|en",
  "result_preview": ["작업1을 할 수 있어요", "작업2를 할 수 있어요", "작업3을 할 수 있어요", "작업4를 할 수 있어요"]
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: analysisPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );
    
    const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
    
    if (!generatedText) {
      throw new Error("No response from Gemini API");
    }
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const analysisData = JSON.parse(jsonText);

    console.log(`[DEBUG] Gemini analysis response:`, JSON.stringify(analysisData, null, 2));

    // Map Gemini response fields to DB schema fields
    // ai_tools -> aiTools
    const aiTools = analysisData.ai_tools || analysisData.aiTools || [];
    console.log(`[DEBUG] Extracted AI tools:`, aiTools);

    // level -> difficulty (convert to uppercase)
    let difficulty: Difficulty;
    const level = analysisData.level || analysisData.difficulty;
    if (level === 'beginner' || level === 'BEGINNER') {
      difficulty = Difficulty.BEGINNER;
    } else if (level === 'intermediate' || level === 'INTERMEDIATE') {
      difficulty = Difficulty.INTERMEDIATE;
    } else if (level === 'advanced' || level === 'ADVANCED') {
      difficulty = Difficulty.ADVANCED;
    } else {
      difficulty = Difficulty.BEGINNER; // Default
    }

    // language (convert to uppercase)
    const language = (analysisData.language === 'ko' || analysisData.language === 'KO')
      ? Language.KO
      : Language.EN;

    // Calculate estimated time from rn_time or fallback to duration/wordCount
    let estimatedTime;
    const rnTime = analysisData.rn_time;

    if (rnTime) {
      // Parse rn_time
      if (typeof rnTime === 'string' && rnTime.includes(':')) {
        // HH:MM:SS format for video
        const parts = rnTime.split(':').map((p: string) => parseInt(p, 10));
        let seconds = 0;
        if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          seconds = parts[0] * 60 + parts[1];
        }
        estimatedTime = {
          type: TimeType.VIDEO,
          value: Math.ceil(seconds / 60) // Convert to minutes
        };
      } else {
        // Number format for text
        const count = parseInt(String(rnTime), 10);
        const isKorean = language === Language.KO;
        const readingTime = isKorean
          ? Math.ceil(count / KOREAN_CHARS_PER_MINUTE)
          : Math.ceil(count / ENGLISH_WORDS_PER_MINUTE);

        estimatedTime = {
          type: isKorean ? TimeType.TEXT_KO : TimeType.TEXT_EN,
          value: readingTime
        };
      }
    } else if (duration) {
      // Fallback to duration parameter
      estimatedTime = {
        type: TimeType.VIDEO,
        value: Math.ceil(duration / 60)
      };
    } else if (wordCount) {
      // Fallback to wordCount parameter
      const isKorean = language === Language.KO;
      const readingTime = isKorean
        ? Math.ceil(wordCount / KOREAN_CHARS_PER_MINUTE)
        : Math.ceil(wordCount / ENGLISH_WORDS_PER_MINUTE);

      estimatedTime = {
        type: isKorean ? TimeType.TEXT_KO : TimeType.TEXT_EN,
        value: readingTime
      };
    }

    // result_preview -> resultPreviews (as per PRD: MUST be exactly 4 text descriptions ending with ~에요)
    const resultPreview = analysisData.result_preview || analysisData.resultPreviews || [];

    if (!Array.isArray(resultPreview) || resultPreview.length !== 4) {
      console.warn(`[WARNING] Expected 4 result_preview items, got ${resultPreview.length}. Gemini may not be following PRD format.`);
    }

    const resultPreviews = resultPreview
      .slice(0, 4) // Take first 4 items
      .map((item: any, index: number) => {
        // All previews should be text descriptions (as per PRD)
        const contentData = typeof item === 'string' ? item : (item.contentData || '');
        return {
          type: PreviewType.TEXT_DESCRIPTION,
          contentData: contentData,
          order: index
        };
      })
      .filter((item: any) => item.contentData.trim().length > 0); // Remove empty items

    // PRD requires exactly 4 items - log if we don't have 4
    if (resultPreviews.length !== 4) {
      console.warn(`[WARNING] ResultPreviews count is ${resultPreviews.length}, expected 4. Some items may have been empty.`);
    }

    return {
      category: analysisData.category,
      aiTools,
      description: analysisData.description,
      tags: analysisData.tags || [],
      difficulty,
      language,
      estimatedTime,
      resultPreviews
    };
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      const statusCode = error.response?.status;

      // If rate limit error (429), add helpful context
      if (statusCode === 429 || errorMessage.includes('Resource exhausted')) {
        throw new Error(`Gemini API rate limit exceeded. Please wait before retrying. ${errorMessage}`);
      }

      throw new Error(`Gemini API error: ${errorMessage}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini response as JSON: ${error.message}`);
    }
    throw error;
  }
}
