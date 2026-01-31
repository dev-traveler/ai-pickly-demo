# PRD: AI Content Collector MCP Server

**버전**: 2.0
**작성일**: 2026년 1월
**상태**: 구현 완료

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [핵심 기능](#핵심-기능)
3. [시스템 아키텍처](#시스템-아키텍처)
4. [데이터 모델](#데이터-모델)
5. [AI 분석 스펙](#ai-분석-스펙)
6. [사용 방법](#사용-방법)
7. [API 및 환경 변수](#api-및-환경-변수)
8. [제약사항 및 제한](#제약사항-및-제한)

---

## 프로젝트 개요

### 목적
AI 튜토리얼 콘텐츠(YouTube 영상, 블로그 글)를 자동으로 수집하고 Gemini AI로 분석하여 Supabase에 저장하는 자동화 시스템

### 주요 특징
- ✅ **MCP 서버 모드**: Claude Desktop과 통합하여 대화형으로 사용
- ✅ **독립 실행 모드**: MCP 없이 CLI로 직접 실행 가능
- ✅ **자동 크롤러**: 24시간 주기로 자동 콘텐츠 수집
- ✅ **AI 자동 분석**: Gemini 2.0 Flash로 콘텐츠 메타데이터 생성
- ✅ **한국어 최적화**: 한국어 콘텐츠 중심 수집 및 분석

### 기술 스택
- **언어**: TypeScript
- **런타임**: Node.js
- **AI 분석**: Google Gemini 2.0 Flash API
- **데이터베이스**: Supabase (PostgreSQL)
- **스토리지**: Supabase Storage
- **크롤링**: Jina.ai Reader API
- **검색**: YouTube Data API v3

---

## 핵심 기능

### 1. 자동 콘텐츠 수집 (Auto Crawler)

#### 수집 프로세스
```
검색 → 크롤링 → AI 분석 → 데이터베이스 저장
```

#### 공식 4개 카테고리
| 카테고리 | 설명 | 검색 키워드 |
|---------|------|-----------|
| **text** | 텍스트 생성, 글쓰기, 문서 작성 | 인공지능 글쓰기 텍스트 생성 문서 작성 ChatGPT Claude |
| **image** | 이미지 생성, 디자인, 시각 콘텐츠 | 인공지능 이미지 생성 그림 만들기 디자인 Midjourney DALL-E |
| **video** | 영상 생성, 편집, 동영상 콘텐츠 | 인공지능 영상 생성 동영상 만들기 편집 Runway |
| **code** | 프로그래밍, 코딩, 개발 | 인공지능 코딩 프로그래밍 개발 Cursor GitHub Copilot |

#### Rate Limiting 안전장치
- **콘텐츠 간 대기**: 60초
- **카테고리 간 대기**: 30초
- **API 재시도**: 최대 3회 (3분, 6분, 9분 백오프)

#### 중복 제거
- URL 기반 중복 체크
- 이미 수집된 콘텐츠 자동 건너뛰기

#### 한국어 필터링
- 제목의 한글 비율 30% 이상만 수집
- 비한국어 콘텐츠 자동 제외

---

### 2. AI 자동 분석 (Gemini 2.0 Flash)

#### 분석 항목

| 필드 | 타입 | 설명 | 예시 |
|-----|------|------|-----|
| **category** | string | 콘텐츠 카테고리 (4개 중 1개) | "text", "image", "video", "code" |
| **ai_tools** | string[] | 사용된 AI 도구 (소문자 무공백) | ["chatgpt", "midjourney"] |
| **rn_time** | string/number | 소요 시간 | "00:10:30" 또는 "1500" |
| **description** | string | 에디터 스타일 설명 (~에요/아요체) | "ChatGPT로 업무를 자동화하는 방법을 배울 수 있어요. 지금 바로 시작해보세요!" |
| **tags** | string[] | 키워드 태그 (3-7개, #포함) | ["#개발자", "#AI활용", "#자동화"] |
| **level** | string | 난이도 (영문 소문자) | "beginner", "intermediate", "advanced" |
| **language** | string | 언어 (2자) | "ko", "en" |
| **result_preview** | string[] | 실용적 예시 (정확히 4개, ~에요 끝맺음) | ["이메일 답장을 작성할 수 있어요", "회의록을 요약할 수 있어요", ...] |

#### AI 도구명 규칙
- **Gemini 출력**: 소문자 무공백 (예: `chatgpt`, `githubcopilot`)
- **DB 저장**: 실제 브랜드 명칭 (예: `ChatGPT`, `GitHub Copilot`)
- **자동 변환**: 90개 이상의 AI 도구 매핑 테이블 내장

#### 난이도 기준
- **beginner**: 복사/붙여넣기로 따라 할 수 있는 경우
- **intermediate**: 프롬프트 작성 또는 수정이 필요한 경우
- **advanced**: 프로그램 설치 및 코딩이 필요한 경우

#### Result Preview 요구사항
- **개수**: 정확히 4개
- **형식**: 짧은 문장 (~에요 끝맺음)
- **내용**: 콘텐츠를 통해 할 수 있는 실용적 작업

---

### 3. 데이터베이스 스키마

#### 저장되는 테이블 (9개)

```
1. Content          - 콘텐츠 기본 정보
2. Category         - 카테고리 (text, image, video, code)
3. ContentCategory  - Content ↔ Category 연결 (Many-to-Many)
4. AITool           - AI 도구 (ChatGPT, Midjourney 등)
5. ContentAITool    - Content ↔ AITool 연결 (Many-to-Many)
6. Tag              - 태그 (#개발자, #AI활용 등)
7. ContentTag       - Content ↔ Tag 연결 (Many-to-Many)
8. EstimatedTime    - 예상 소요 시간 (One-to-One)
9. ResultPreview    - 실용적 예시 4개 (One-to-Many)
```

#### Category 테이블
```sql
id: text | image | video | code (카테고리명과 동일)
name: text | image | video | code
slug: text | image | video | code
```

#### AITool 테이블
```sql
id: tool-{nanoid}
name: ChatGPT | GitHub Copilot | Midjourney (실제 브랜드명)
slug: chatgpt | githubcopilot | midjourney (소문자 무공백)
logoUrl: https://...supabase.co/.../chatgpt-tool-abc123.png
```

#### Content 테이블
```sql
id: CONTENTS-{nanoid}
title: string
description: string (~에요/아요체)
author: string
sourceUrl: string (URL)
publishedAt: timestamp
language: KO | EN
thumbnailUrl: string (Supabase Storage URL)
difficulty: BEGINNER | INTERMEDIATE | ADVANCED
viewCount: number
scrapCount: number
createdAt: timestamp
updatedAt: timestamp
```

#### EstimatedTime 테이블
```sql
id: time-{nanoid}
contentId: CONTENTS-{nanoid}
type: VIDEO | TEXT_KO | TEXT_EN
value: number (minutes)
displayMinutes: number
```

#### ResultPreview 테이블
```sql
id: preview-{nanoid}
contentId: CONTENTS-{nanoid}
order: 0 | 1 | 2 | 3
type: TEXT_DESCRIPTION
contentData: string (~에요 끝맺음)
```

---

## 시스템 아키텍처

### 실행 모드

#### 1. MCP 서버 모드
```bash
# Claude Desktop에서 자동 실행
# 대화형으로 콘텐츠 수집 및 조회
```

**사용 가능한 도구:**
- `collect_content`: URL로 콘텐츠 수집
- `list_content`: 저장된 콘텐츠 조회
- `get_content`: 특정 콘텐츠 상세 조회
- `list_categories`: 카테고리 목록 조회

#### 2. 자동 크롤러 모드
```bash
# 1회 실행
npm run crawler:once

# 24시간 주기 반복 실행
npm run crawler
```

**동작:**
- 4개 카테고리에서 자동 검색
- 각 카테고리당 N개 수집 (기본 5개)
- AI 분석 및 자동 저장
- 중복 자동 건너뛰기

#### 3. 단일 URL 수집 모드
```bash
# 특정 URL만 수집
npm run collect https://youtube.com/watch?v=abc123
```

**동작:**
- 1개 URL 크롤링
- AI 분석
- DB 저장
- 즉시 종료

---

## 데이터 모델

### ContentPackage (내부 데이터 구조)

```typescript
interface ContentPackage {
  content: {
    id: string;                    // CONTENTS-{nanoid}
    title: string;                 // 콘텐츠 제목
    description: string;           // AI 생성 설명 (~에요/아요체)
    author: string;                // 작성자
    sourceUrl: string;             // 원본 URL
    publishedAt: string;           // 발행일 (ISO 8601)
    language: "KO" | "EN";         // 언어
    thumbnailUrl?: string;         // 썸네일 URL (Supabase Storage)
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    viewCount: number;             // 조회수 (기본 0)
    scrapCount: number;            // 스크랩수 (기본 0)
    updatedAt: string;             // 수정일
  };

  categories: string[];            // ["text"] (1개)
  aiTools: string[];               // ["chatgpt", "claude"] (소문자)
  tags: string[];                  // ["#개발자", "#AI활용"] (3-7개)

  estimatedTime?: {
    type: "VIDEO" | "TEXT_KO" | "TEXT_EN";
    value: number;                 // 분 단위
    displayMinutes: number;
  };

  resultPreviews?: Array<{
    order: number;                 // 0, 1, 2, 3
    type: "TEXT_DESCRIPTION";
    contentData: string;           // ~에요 끝맺음
  }>;
}
```

---

## AI 분석 스펙

### Gemini Prompt 구조

```typescript
당신은 AI 콘텐츠 분석 전문 에디터입니다. 다음 콘텐츠를 분석하여 정확한 메타데이터를 생성해주세요.

제목: ${title}
URL: ${url}
내용: ${content.substring(0, 3000)}

[필드별 상세 조건]

1. category: text|image|video|code 중 1개 선택
2. ai_tools: 소문자 무공백 배열 (예: ["chatgpt", "midjourney"])
3. rn_time: 영상은 "HH:MM:SS", 텍스트는 글자수/단어수
4. description: ~에요/아요체 1-2문장 (마지막은 CTA)
5. tags: #기호 포함, 첫 태그는 직무 중심, 3-7개, 중복 없음
6. level: beginner|intermediate|advanced
7. language: ko|en
8. result_preview: ~에요 끝맺음, 정확히 4개 문장

정확히 다음 JSON 형식으로만 응답:
{
  "category": "text",
  "ai_tools": ["chatgpt"],
  "rn_time": "00:10:30",
  "description": "설명...",
  "tags": ["#개발자", "#AI활용"],
  "level": "beginner",
  "language": "ko",
  "result_preview": ["작업1을 할 수 있어요", "작업2를 할 수 있어요", "작업3을 할 수 있어요", "작업4를 할 수 있어요"]
}
```

### Gemini API 설정
```typescript
{
  model: "gemini-2.0-flash",
  endpoint: "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
  generationConfig: {
    temperature: 0.2,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024
  }
}
```

---

## 사용 방법

### 설치 및 설정

#### 1. 프로젝트 설치
```bash
cd ai-content-collector-mcp-server
npm install
npm run build
```

#### 2. 환경 변수 설정 (.env)
```env
# 필수 변수
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-api-key

# 선택 변수 (검색 기능 사용 시)
YOUTUBE_API_KEY=your-youtube-api-key

# 크롤러 설정
ITEMS_PER_CATEGORY=2           # 카테고리당 수집 개수
CRAWL_INTERVAL_HOURS=24        # 실행 주기 (시간)
RUN_ONCE=true                  # 1회만 실행 여부
```

### 사용 시나리오

#### 시나리오 1: 자동 크롤러로 대량 수집
```bash
# .env 설정
ITEMS_PER_CATEGORY=5
RUN_ONCE=true

# 실행 (카테고리당 5개씩, 총 20개 수집)
npm run crawler:once
```

**예상 결과:**
```
╔════════════════════════════════════════╗
║      AI 콘텐츠 자동 수집 시스템         ║
╚════════════════════════════════════════╝

🚀 AI 콘텐츠 수집을 시작합니다
⏰ 시작 시간: 2026.01.21 15:30
📊 카테고리당 수집 개수: 5개

✅ 데이터베이스 연결 완료

📋 총 4개 카테고리에서 콘텐츠를 수집합니다:
  • 텍스트 생성
  • 이미지 생성
  • 영상 생성
  • 코딩/개발

==================================================
📂 카테고리: 텍스트 생성
🎯 목표: 5개 콘텐츠 수집
==================================================

🔍 검색어: "인공지능 글쓰기 텍스트 생성 문서 작성 ChatGPT Claude"
✓ 10개의 검색 결과를 찾았습니다

  📄 [1/5] ChatGPT로 문서 작성 자동화...
     📥 1/4 콘텐츠 크롤링 중...
     🤖 2/4 AI 분석 중...
     ✓ 분석 완료 (난이도: BEGINNER)
     💾 3/4 데이터베이스 저장 중...
     ✅ 4/4 저장 완료!
     📊 AI 도구: chatgpt

     ⏰ API 안전을 위해 60초 대기 중...

  ... (생략) ...

✅ 텍스트 생성 카테고리 완료: 5/5개 저장

📊 ════════════════════════════════════════
              수집 결과 요약
════════════════════════════════════════
🔍 검색된 콘텐츠:      40개
📥 크롤링 완료:        20개
🤖 AI 분석 완료:       20개
💾 저장 완료:          20개
⏭️  중복 건너뛰기:     0개
❌ 오류 발생:          0개
════════════════════════════════════════

✅ 수집이 성공적으로 완료되었습니다 (2026.01.21 16:45)
```

#### 시나리오 2: 특정 URL만 수집
```bash
npm run collect https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**예상 결과:**
```
🔍 콘텐츠 수집 중: https://www.youtube.com/watch?v=dQw4w9WgXcQ

✅ Supabase initialized
🔎 중복 체크 중...
📥 콘텐츠 크롤링 중...
   제목: ChatGPT 활용법
   작성자: AI 튜토리얼

🤖 Gemini AI 분석 중...
   카테고리: text
   AI 도구: chatgpt, claude
   난이도: BEGINNER
   태그: #개발자, #AI활용, #자동화

💾 데이터베이스 저장 중...

✅ 성공!
   콘텐츠 ID: CONTENTS-12345
   설명: ChatGPT로 업무 자동화하는 방법을 알려주는 실용적인 가이드에요...
```

#### 시나리오 3: Claude Desktop과 대화형 사용
```
사용자: AI 코딩 튜토리얼 5개 찾아줘

Claude: collect_content 도구로 "인공지능 코딩" 검색을 시작하겠습니다.
        [자동으로 YouTube 검색 → 크롤링 → AI 분석 → 저장]

        총 5개의 콘텐츠를 찾아 저장했습니다:
        1. Cursor로 코딩하기 (난이도: INTERMEDIATE)
        2. GitHub Copilot 완전 정복 (난이도: BEGINNER)
        ...
```

### 주기적 실행 설정

#### 24시간 자동 반복
```bash
# .env 설정
RUN_ONCE=false
CRAWL_INTERVAL_HOURS=24

# 실행 (계속 실행됨)
npm run crawler
```

#### cron으로 스케줄링
```bash
# crontab -e
0 0 * * * cd /path/to/project && npm run crawler:once >> /var/log/crawler.log 2>&1
```

---

## API 및 환경 변수

### 필수 API 키

#### 1. Supabase
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```
- **발급**: https://supabase.com → 프로젝트 → Settings → API
- **용도**: 데이터베이스 및 스토리지 접근

#### 2. Gemini API
```
GEMINI_API_KEY=AIzaSy...
```
- **발급**: https://aistudio.google.com/app/apikey
- **모델**: gemini-2.0-flash
- **무료 제한**: 15 RPM (분당 요청), 1.5M TPM (토큰/분)

#### 3. YouTube Data API v3
```
YOUTUBE_API_KEY=AIzaSy...
```
- **발급**: https://console.cloud.google.com → APIs & Services → Credentials
- **용도**: YouTube 영상 검색
- **무료 제한**: 10,000 quota/day

### 선택 API 키

#### 4. Google Custom Search API (현재 미사용)
```
GOOGLE_API_KEY=AIzaSy...
GOOGLE_CSE_ID=your-search-engine-id
```
- **발급**: https://console.cloud.google.com → Custom Search API
- **용도**: 블로그 검색
- **참고**: 현재 YouTube 검색만 사용 중

### 크롤러 설정

```env
ITEMS_PER_CATEGORY=5           # 카테고리당 수집할 개수 (기본 5)
CRAWL_INTERVAL_HOURS=24        # 실행 주기 시간 (기본 24)
RUN_ONCE=true                  # 1회만 실행 (기본 false)
```

---

## 제약사항 및 제한

### Rate Limits

| API | 제한 | 대응 방법 |
|-----|------|----------|
| **Gemini API** | 15 RPM, 1.5M TPM | 콘텐츠 간 60초 대기, 재시도 3/6/9분 백오프 |
| **YouTube API** | 10,000 quota/day | 검색 결과 제한 (카테고리당 최대 10개) |
| **Jina.ai Reader** | 무료 플랜 제한 | 콘텐츠 크롤링 실패 시 건너뛰기 |

### 수집 제한

#### 언어
- **지원**: 한국어 콘텐츠 우선
- **필터링**: 한글 비율 30% 미만 제외

#### 소스
- **YouTube**: 완전 지원
- **블로그**: Google Custom Search 활성화 필요 (현재 비활성)

#### 콘텐츠 타입
- **YouTube 영상**: ✅ 완전 지원
- **블로그 글**: ⚠️ API 활성화 필요
- **PDF**: ❌ 미지원
- **이미지**: ❌ 미지원

### 저장소 제한

#### Supabase Storage
- **썸네일**: 자동 업로드 (contents_thumbnail 버킷)
- **AI 도구 로고**: 자동 업로드 (ai-tool-logos 버킷)
- **용량**: Supabase 무료 플랜 기준 (1GB)

### 기술적 제약

#### Gemini API
- **모델 버전**: gemini-2.0-flash (v1 API)
- **지원 종료 모델**: gemini-1.5-flash (404 에러)
- **응답 형식**: JSON만 지원

#### 데이터베이스
- **관계형 구조**: Many-to-Many 연결 필수
- **ID 생성**: nanoid 사용 (충돌 가능성 극히 낮음)

---

## 트러블슈팅

### 일반적인 문제

#### 1. Gemini API Rate Limit
**증상:**
```
⏰ API 제한 도달. 3분 대기 후 재시도 (1/3)...
```

**해결:**
```env
# .env에서 수집 속도 줄이기
ITEMS_PER_CATEGORY=1
CRAWL_INTERVAL_HOURS=48
```

#### 2. Supabase 연결 오류
**증상:**
```
❌ 데이터베이스 연결 실패: Supabase client not initialized
```

**해결:**
1. `.env` 파일에서 `SUPABASE_URL`과 `SUPABASE_KEY` 확인
2. Supabase 대시보드에서 API 키 재생성
3. 프로젝트가 일시 중지되지 않았는지 확인

#### 3. YouTube API Quota 초과
**증상:**
```
❌ YouTube search failed: quotaExceeded
```

**해결:**
- 다음 날까지 대기 (quota는 매일 자정 PST에 리셋)
- 또는 Google Cloud Console에서 quota 증가 요청

#### 4. 한글 콘텐츠가 수집되지 않음
**증상:**
```
🌍 건너뛰기: 한국어 콘텐츠가 아닙니다
```

**해결:**
- 검색 키워드에 한글 포함 여부 확인
- `isKoreanContent()` 함수의 한글 비율 기준 조정 (현재 30%)

---

## 향후 개선 사항

### 단기 (v2.1)
- [ ] Google Custom Search API 활성화 (블로그 검색)
- [ ] 수집 진행률 실시간 대시보드
- [ ] 실패한 콘텐츠 재시도 큐

### 중기 (v3.0)
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 콘텐츠 품질 점수 시스템
- [ ] 자동 태그 추천 시스템

### 장기 (v4.0)
- [ ] 웹 UI 대시보드
- [ ] 사용자 맞춤 추천 알고리즘
- [ ] 콘텐츠 자동 요약 기능

---

## 라이선스 및 크레딧

### 사용 기술
- **MCP SDK**: @modelcontextprotocol/sdk
- **Supabase**: @supabase/supabase-js
- **Gemini API**: Google Generative AI
- **Jina.ai**: Web Content Reader

### 라이선스
MIT License

### 작성자
AI Content Collector Team

### 버전 히스토리
- **v2.0** (2026.01): 한글 로그, AI 도구명 브랜드화, ResultPreview 4개 강제
- **v1.0** (2026.01): 초기 버전, 기본 크롤러 기능

---

## 부록

### A. AI 도구 매핑 테이블 (일부)

| 소문자 (Gemini 출력) | 브랜드명 (DB 저장) |
|---------------------|------------------|
| chatgpt | ChatGPT |
| claude | Claude |
| githubcopilot | GitHub Copilot |
| midjourney | Midjourney |
| dalle | DALL-E |
| stablediffusion | Stable Diffusion |
| cursor | Cursor |
| v0 | v0 |
| bolt | Bolt |

전체 목록: [src/constants.ts](src/constants.ts) 참조

### B. 예시 Gemini 응답

```json
{
  "category": "text",
  "ai_tools": ["chatgpt", "claude"],
  "rn_time": "00:15:30",
  "description": "ChatGPT와 Claude를 활용해 블로그 글을 자동으로 작성하는 방법을 배울 수 있어요. 지금 바로 시작해보세요!",
  "tags": ["#개발자", "#AI활용", "#블로그", "#ChatGPT", "#Claude"],
  "level": "beginner",
  "language": "ko",
  "result_preview": [
    "블로그 포스트 초안을 자동으로 생성할 수 있어요",
    "SEO 최적화된 제목을 만들 수 있어요",
    "글의 구조를 체계적으로 잡을 수 있어요",
    "맞춤법과 문법을 자동으로 교정할 수 있어요"
  ]
}
```

### C. 데이터베이스 ER 다이어그램

```
Content (1) ─────< ContentCategory >───── (N) Category
   │
   ├── (1) ─────< ContentAITool >────── (N) AITool
   │
   ├── (1) ─────< ContentTag >────────── (N) Tag
   │
   ├── (1) ───── EstimatedTime (1)
   │
   └── (1) ─────< ResultPreview (4)
```

### D. 주요 명령어 요약

```bash
# 설치 및 빌드
npm install
npm run build

# 실행 모드
npm run crawler:once          # 자동 크롤러 (1회)
npm run crawler               # 자동 크롤러 (24시간 반복)
npm run collect <URL>         # 단일 URL 수집
npm run dev:crawler           # 개발 모드 (tsx)

# MCP 서버 모드
# Claude Desktop 설정 후 자동 실행
```

---

**문서 버전**: 2.0
**최종 수정**: 2026년 1월 21일
**다음 리뷰**: 2026년 2월 1일
