# 사용 가이드 - MCP 없이 사용하기

## 🎯 개요

이 프로젝트는 **MCP 없이도** 완벽하게 작동합니다. `.env` 파일의 API 키만으로 모든 기능을 사용할 수 있습니다.

## 📋 사전 준비

### 1. 환경 변수 설정 (.env 파일)

```env
# 필수 - Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

# 필수 - Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# 선택 - 검색 기능 사용 시
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-custom-search-engine-id

# 크롤러 설정
ITEMS_PER_CATEGORY=2        # 카테고리당 수집 개수
CRAWL_INTERVAL_HOURS=24     # 실행 주기 (시간)
RUN_ONCE=true               # 1회만 실행 여부
```

### 2. 설치

```bash
npm install
npm run build
```

---

## 🚀 사용 방법

### 방법 1: 자동 크롤러 (권장)

4개 공식 카테고리(text, image, video, code)에서 자동으로 콘텐츠를 수집합니다.

#### 1회 실행 (테스트용)
```bash
npm run crawler:once
```

#### 지속 실행 (24시간 주기)
```bash
npm run crawler
```

**자동으로 수행하는 작업:**
1. ✅ YouTube/Google에서 AI 관련 콘텐츠 검색
2. ✅ URL 크롤링 및 메타데이터 추출
3. ✅ Gemini AI로 자동 분석 (카테고리, AI 도구, 태그 등)
4. ✅ Supabase에 자동 저장
5. ✅ 중복 체크 및 스킵
6. ✅ Rate Limit 자동 관리

**실행 예시:**
```
🚀 Starting AI Content Crawler
⏰ Time: 2026-01-20T12:00:00.000Z
📊 Items per category: 2

📋 Using 4 official categories from PRD:
  - text
  - image
  - video
  - code

📂 Crawling category: text
Target: 2 items
🔍 Search query: "인공지능 글쓰기 텍스트 생성 문서 작성 ChatGPT Claude"
Found 4 search results

  📄 Processing: ChatGPT로 문서 작성 자동화...
  📥 Scraping...
  🤖 Analyzing with AI...
  💾 Saving to database...
  ✅ Saved! ID: CONTENTS-12345
```

---

### 방법 2: 단일 URL 수집

특정 URL만 수집하고 싶을 때 사용합니다.

```bash
# YouTube 영상
npm run collect https://youtube.com/watch?v=abc123

# 블로그 글
npm run collect https://example.com/blog/ai-tutorial
```

**실행 예시:**
```bash
$ npm run collect https://youtube.com/watch?v=dQw4w9WgXcQ

🔍 Collecting content from: https://youtube.com/watch?v=dQw4w9WgXcQ

✅ Supabase initialized
🔎 Checking for duplicates...
📥 Scraping content...
   Title: ChatGPT 활용법
   Author: AI 튜토리얼

🤖 Analyzing with Gemini AI...
   Category: text
   AI Tools: chatgpt, claude
   Difficulty: BEGINNER
   Tags: #개발자, #AI활용, #자동화

💾 Saving to database...

✅ Success!
   Content ID: CONTENTS-12345
   Description: ChatGPT로 업무 자동화하는 방법을 알려주는 실용적인 가이드에요...
```

---

### 방법 3: 프로그래밍 방식

TypeScript/JavaScript 코드에서 직접 사용:

```typescript
import "dotenv/config";
import { initializeSupabase, saveContentToSupabase } from "./src/services/supabase.js";
import { scrapeUrl } from "./src/services/scraper.js";
import { analyzeContent } from "./src/services/analyzer.js";

// 초기화
initializeSupabase(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// URL에서 콘텐츠 수집
const url = "https://youtube.com/watch?v=abc123";

// 1. 크롤링
const scraped = await scrapeUrl(url);

// 2. AI 분석
const analysis = await analyzeContent(
  scraped.title,
  scraped.content,
  scraped.url,
  scraped.duration,
  scraped.wordCount
);

// 3. DB 저장
const contentPackage = {
  content: {
    id: "",
    title: scraped.title,
    description: analysis.description,
    author: scraped.author || "Unknown",
    sourceUrl: scraped.url,
    publishedAt: scraped.publishedAt || new Date().toISOString(),
    language: analysis.language,
    thumbnailUrl: scraped.thumbnailUrl,
    difficulty: analysis.difficulty,
    viewCount: 0,
    scrapCount: 0,
    updatedAt: new Date().toISOString()
  },
  categories: [analysis.category],
  aiTools: analysis.aiTools,
  tags: analysis.tags,
  estimatedTime: analysis.estimatedTime,
  resultPreviews: analysis.resultPreviews
};

const result = await saveContentToSupabase(contentPackage);
console.log("Saved:", result.contentId);
```

---

## 🎯 기능 비교

| 기능 | 자동 크롤러 | 단일 URL 수집 | 프로그래밍 방식 |
|------|------------|--------------|----------------|
| **명령어** | `npm run crawler` | `npm run collect <URL>` | TypeScript 코드 |
| **자동 검색** | ✅ 4개 카테고리 | ❌ | 직접 구현 가능 |
| **URL 지정** | ❌ 검색 결과 사용 | ✅ | ✅ |
| **배치 처리** | ✅ | ❌ 1개씩 | ✅ |
| **스케줄링** | ✅ 24시간 주기 | ❌ | 직접 구현 가능 |
| **중복 체크** | ✅ | ✅ | ✅ |
| **Rate Limit** | ✅ 자동 관리 | ✅ 수동 대기 | 직접 구현 필요 |

---

## ⚙️ 고급 설정

### Rate Limit 조정

Gemini API Rate Limit을 피하려면 `.env` 파일 수정:

```env
# 수집 속도 줄이기
ITEMS_PER_CATEGORY=1

# 실행 주기 늘리기
CRAWL_INTERVAL_HOURS=48
```

### 특정 카테고리만 수집

[src/crawler.ts](src/crawler.ts) 수정:

```typescript
// 모든 카테고리 대신
const categories = OFFICIAL_CATEGORIES;

// 특정 카테고리만
const categories = ["text", "code"];
```

---

## 🐛 문제 해결

### Gemini API Rate Limit 오류

**증상:**
```
⏰ Rate limit hit. Waiting 180s before retry 1/3...
```

**해결:**
1. `ITEMS_PER_CATEGORY=1`로 줄이기
2. 60초 이상 간격으로 실행
3. `gemini-1.5-flash` 모델 사용 (이미 적용됨)

### Supabase 연결 오류

**증상:**
```
Error: Supabase client not initialized
```

**해결:**
1. `.env` 파일에 `SUPABASE_URL`과 `SUPABASE_KEY` 확인
2. Supabase 대시보드에서 API 키 재생성

---

## 📝 요약

**MCP 없이도 완벽하게 작동합니다!**

- ✅ **자동 크롤러**: `npm run crawler:once`
- ✅ **단일 URL**: `npm run collect <URL>`
- ✅ **프로그래밍**: TypeScript로 직접 호출

모든 기능이 `.env` 파일의 API 키로 작동합니다. 🎉
