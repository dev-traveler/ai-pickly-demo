# AI Content Collector MCP Server

**버전 2.0 - 완전 자동화된 AI 콘텐츠 수집 시스템**

YouTube에서 AI 튜토리얼 콘텐츠를 자동으로 검색, 크롤링, AI 분석, Supabase 저장까지 원스톱으로 처리하는 시스템입니다.

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/yourusername/ai-content-collector-mcp-server)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📖 문서

- **[PRD.md](PRD.md)** - 완전한 제품 요구사항 명세서 (권장)
- **[USAGE.md](USAGE.md)** - MCP 없이 사용하는 방법
- **[CLAUDE.md](CLAUDE.md)** - Claude Desktop 설정 가이드

---

## 🎯 주요 기능

### ✅ 3가지 실행 모드

#### 1. 🤖 자동 크롤러 모드 (권장)
```bash
# 1회 실행
npm run crawler:once

# 24시간 주기 반복
npm run crawler
```
- 완전 자동화된 콘텐츠 수집
- 4개 공식 카테고리 (텍스트, 이미지, 영상, 코드)
- Gemini AI 자동 분석
- 중복 자동 스킵
- Rate Limit 자동 관리

#### 2. 🔗 단일 URL 수집
```bash
npm run collect https://youtube.com/watch?v=abc123
```
- 특정 URL만 빠르게 수집
- 즉시 분석 및 저장
- 테스트용으로 적합

#### 3. 💬 MCP 서버 모드
Claude Desktop과 대화형으로 사용
- 실시간 대화형 제어
- 맞춤 검색 및 필터링
- 수동 큐레이션

---

## 🚀 빠른 시작

### 1. 설치
```bash
cd ai-content-collector-mcp-server
npm install
npm run build
```

### 2. 환경 변수 설정 (.env)
```env
# 필수
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-api-key

# 선택 (검색 기능 사용 시)
YOUTUBE_API_KEY=your-youtube-api-key

# 크롤러 설정
ITEMS_PER_CATEGORY=2           # 카테고리당 수집 개수
CRAWL_INTERVAL_HOURS=24        # 실행 주기 (시간)
RUN_ONCE=true                  # 1회만 실행 여부
```

### 3. 실행
```bash
# 자동 크롤러 (1회)
npm run crawler:once

# 결과 확인
# Supabase 대시보드에서 저장된 콘텐츠 확인
```

---

## 📊 시스템 구조

### 수집 프로세스
```
YouTube 검색 → 콘텐츠 크롤링 → Gemini AI 분석 → Supabase 저장
     ↓              ↓                ↓              ↓
  검색 결과      메타데이터        AI 메타데이터    9개 테이블
   (API)       (Jina.ai)         (Gemini)       (PostgreSQL)
```

### 공식 4개 카테고리

| ID | 이름 | 설명 | 검색 키워드 |
|----|------|------|-----------|
| **text** | 텍스트 생성 | 글쓰기, 문서 작성 | 인공지능 글쓰기 텍스트 생성 ChatGPT Claude |
| **image** | 이미지 생성 | 디자인, 시각 콘텐츠 | 인공지능 이미지 생성 Midjourney DALL-E |
| **video** | 영상 생성 | 동영상 편집 | 인공지능 영상 생성 Runway |
| **code** | 코딩/개발 | 프로그래밍 | 인공지능 코딩 Cursor GitHub Copilot |

---

## 🤖 AI 분석 기능

### Gemini 2.0 Flash로 자동 생성

| 항목 | 설명 | 예시 |
|-----|------|-----|
| **카테고리** | 4개 중 1개 자동 분류 | text, image, video, code |
| **AI 도구** | 사용된 도구 감지 | ChatGPT, Midjourney |
| **설명** | 친절한 한글 설명 (~에요체) | "ChatGPT로 업무를 자동화할 수 있어요!" |
| **태그** | 직무 중심 키워드 | #개발자, #AI활용, #자동화 |
| **난이도** | 3단계 자동 판정 | BEGINNER, INTERMEDIATE, ADVANCED |
| **소요 시간** | 자동 계산 | 15분 (영상), 5분 (텍스트) |
| **실용 예시** | 4개 활용 방법 | "이메일 답장을 작성할 수 있어요" × 4 |

### AI 도구 자동 매핑
- **Gemini 출력**: 소문자 무공백 (`chatgpt`, `githubcopilot`)
- **DB 저장**: 실제 브랜드명 (`ChatGPT`, `GitHub Copilot`)
- **90개 이상** 도구 자동 인식 및 로고 다운로드

---

## 💾 데이터베이스

### 저장되는 9개 테이블
```
1. Content          - 콘텐츠 기본 정보
2. Category         - 카테고리 (text, image, video, code)
3. ContentCategory  - Content ↔ Category 연결
4. AITool           - AI 도구 (ChatGPT, Midjourney 등)
5. ContentAITool    - Content ↔ AITool 연결
6. Tag              - 태그 (#개발자, #AI활용 등)
7. ContentTag       - Content ↔ Tag 연결
8. EstimatedTime    - 예상 소요 시간
9. ResultPreview    - 실용적 예시 (4개)
```

### 자동 기능
- ✅ 중복 체크 (URL 기반)
- ✅ 썸네일 업로드 (Supabase Storage)
- ✅ AI 도구 로고 업로드
- ✅ Many-to-Many 관계 자동 처리
- ✅ 타임스탬프 자동 생성

---

## 📝 사용 예시

### 예시 1: 자동 크롤러
```bash
$ npm run crawler:once

╔════════════════════════════════════════╗
║      AI 콘텐츠 자동 수집 시스템         ║
╚════════════════════════════════════════╝

🚀 AI 콘텐츠 수집을 시작합니다
⏰ 시작 시간: 2026.01.21 15:30
📊 카테고리당 수집 개수: 2개

✅ 데이터베이스 연결 완료

📋 총 4개 카테고리에서 콘텐츠를 수집합니다:
  • 텍스트 생성
  • 이미지 생성
  • 영상 생성
  • 코딩/개발

==================================================
📂 카테고리: 텍스트 생성
🎯 목표: 2개 콘텐츠 수집
==================================================

🔍 검색어: "인공지능 글쓰기 텍스트 생성 문서 작성 ChatGPT Claude"
✓ 4개의 검색 결과를 찾았습니다

  📄 [1/2] ChatGPT로 문서 작성 자동화...
     📥 1/4 콘텐츠 크롤링 중...
     🤖 2/4 AI 분석 중...
     ✓ 분석 완료 (난이도: BEGINNER)
     💾 3/4 데이터베이스 저장 중...
     ✅ 4/4 저장 완료!
     📊 AI 도구: chatgpt

     ⏰ API 안전을 위해 60초 대기 중...

  📄 [2/2] Claude AI로 글쓰기 마스터하기...
     📥 1/4 콘텐츠 크롤링 중...
     🤖 2/4 AI 분석 중...
     ✓ 분석 완료 (난이도: INTERMEDIATE)
     💾 3/4 데이터베이스 저장 중...
     ✅ 4/4 저장 완료!
     📊 AI 도구: claude

✅ 텍스트 생성 카테고리 완료: 2/2개 저장

📊 ════════════════════════════════════════
              수집 결과 요약
════════════════════════════════════════
🔍 검색된 콘텐츠:      16개
📥 크롤링 완료:        8개
🤖 AI 분석 완료:       8개
💾 저장 완료:          8개
⏭️  중복 건너뛰기:     0개
❌ 오류 발생:          0개
════════════════════════════════════════

✅ 수집이 성공적으로 완료되었습니다 (2026.01.21 16:45)
```

### 예시 2: 단일 URL 수집
```bash
$ npm run collect https://youtube.com/watch?v=abc123

🔍 콘텐츠 수집 중: https://youtube.com/watch?v=abc123

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

### 예시 3: Claude Desktop 대화형
```
사용자: AI 코딩 튜토리얼 5개 찾아줘

Claude: collect_content 도구로 검색을 시작하겠습니다.
        [자동으로 YouTube 검색 → 크롤링 → AI 분석 → 저장]

        총 5개의 콘텐츠를 찾아 저장했습니다:
        1. Cursor로 코딩하기 (난이도: INTERMEDIATE) - CONTENTS-12345
        2. GitHub Copilot 완전 정복 (난이도: BEGINNER) - CONTENTS-67890
        3. AI로 코드 자동 생성 (난이도: ADVANCED) - CONTENTS-11111
        ...
```

---

## ⚙️ 고급 설정

### Rate Limiting
```env
# Gemini API 제한 피하기
ITEMS_PER_CATEGORY=1           # 수집 속도 줄이기
CRAWL_INTERVAL_HOURS=48        # 실행 주기 늘리기
```

### 크롤러 커스터마이징
[src/crawler.ts](src/crawler.ts) 수정:
```typescript
// 특정 카테고리만 수집
const categories = ["text", "code"];  // image, video 제외

// 검색 키워드 변경
const queries = {
  "text": "나만의 검색어..."
};
```

### 주기적 실행 (cron)
```bash
# crontab -e
0 0 * * * cd /path/to/project && npm run crawler:once
```

---

## 🔧 API 키 발급

| API | 발급 URL | 용도 | 무료 제한 |
|-----|---------|------|----------|
| **Supabase** | https://supabase.com | DB, Storage | 500MB DB, 1GB Storage |
| **Gemini** | https://aistudio.google.com/app/apikey | AI 분석 | 15 RPM, 1.5M TPM |
| **YouTube** | https://console.cloud.google.com | 검색 | 10,000 quota/day |

---

## 🐛 트러블슈팅

### 일반적인 문제

#### Gemini API Rate Limit
```
⏰ API 제한 도달. 3분 대기 후 재시도...
```
**해결:** `.env`에서 `ITEMS_PER_CATEGORY=1`로 줄이기

#### Supabase 연결 오류
```
❌ 데이터베이스 연결 실패
```
**해결:** `SUPABASE_URL`과 `SUPABASE_KEY` 확인

#### YouTube API Quota 초과
```
❌ YouTube search failed: quotaExceeded
```
**해결:** 다음 날까지 대기 (quota는 매일 자정 PST 리셋)

#### 한글 콘텐츠 없음
```
🌍 건너뛰기: 한국어 콘텐츠가 아닙니다
```
**해결:** 검색 키워드에 한글 포함 확인

---

## 📚 관련 문서

- **[PRD.md](PRD.md)** - 완전한 제품 요구사항 명세서
- **[USAGE.md](USAGE.md)** - MCP 없이 사용하는 방법
- **[CLAUDE.md](CLAUDE.md)** - Claude Desktop 설정 가이드

---

## 🎨 주요 특징

### ✅ 완전 자동화
- 사람이 URL을 찾을 필요 없음
- 검색 → 분석 → 저장까지 한 번에
- 24시간 주기 자동 실행 가능

### ✅ 지능형 분석
- Gemini AI로 정확한 분류
- 한국어 자연어 설명 자동 생성
- 난이도 자동 판정

### ✅ 한글 최적화
- 한국어 콘텐츠 우선 수집
- ~에요/아요체 친절한 설명
- 직무 중심 태그 생성

### ✅ 중복 방지
- URL 기반 자동 중복 검사
- 이미 있는 콘텐츠 건너뛰기

### ✅ 확장 가능
- 새로운 AI 도구 자동 등록
- 카테고리별 필터링 지원
- 페이지네이션으로 대량 데이터 처리

### ✅ 안전한 Rate Limiting
- 콘텐츠 간 60초 대기
- 카테고리 간 30초 대기
- 최대 3회 재시도 (3/6/9분 백오프)

---

## 🛠 개발

```bash
# 개발 모드 실행 (MCP 서버)
npm run dev

# 개발 모드 실행 (크롤러)
npm run dev:crawler

# 빌드
npm run build

# TypeScript 타입 체크
npx tsc --noEmit
```

---

## 📈 향후 계획

### v2.1
- [ ] Google Custom Search API 활성화 (블로그 검색)
- [ ] 실시간 진행률 대시보드
- [ ] 실패 콘텐츠 재시도 큐

### v3.0
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 콘텐츠 품질 점수
- [ ] 자동 태그 추천

### v4.0
- [ ] 웹 UI 대시보드
- [ ] 맞춤 추천 알고리즘
- [ ] 콘텐츠 자동 요약

---

## 📄 라이선스

MIT License

---

## 🤝 기여

이슈와 PR은 언제든 환영합니다!

- 버그 리포트: [Issues](https://github.com/yourusername/ai-content-collector-mcp-server/issues)
- 기능 제안: [Discussions](https://github.com/yourusername/ai-content-collector-mcp-server/discussions)

---

**Made with ❤️ for AI Content Curators**

**Version 2.0** | **Updated: 2026.01.21**
