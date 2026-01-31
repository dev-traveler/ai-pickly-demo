# 🎉 AI Content Collector - 완전 자동화 버전!

## 📦 프로젝트 개요

**완전 자동화된 AI 콘텐츠 DB 수집 시스템**이 완성되었습니다!

### 🎯 두 가지 실행 모드

#### 1. 🤖 자동 크롤러 모드 (추천, NEW!)
**백그라운드에서 완전 자동 실행**
- ✅ 사람 개입 없이 24시간 자동 수집
- ✅ DB에서 카테고리 동적 로드 (새 카테고리 자동 반영)
- ✅ 썸네일 자동 업로드 → `contents_thumbnail` Storage
- ✅ AI Tool 로고 자동 수집 및 업로드 → `ai-tool-logos` Storage
- ✅ 중복 자동 스킵
- ✅ systemd/Docker/PM2로 서비스화 가능

#### 2. 💬 MCP 서버 모드
**Claude와 대화로 제어**
- ✅ Claude Desktop과 연동
- ✅ 대화만으로 콘텐츠 수집
- ✅ 수동 제어 및 필터링

---

## 🚀 핵심 개선사항

### NEW! 완전 자동화
```bash
# 설정만 하면 끝!
npm run crawler

# → 24시간마다 자동으로:
#   1. DB에서 카테고리 로드
#   2. 각 카테고리별 콘텐츠 검색
#   3. 스크래핑 + AI 분석
#   4. 썸네일/로고 Storage 업로드
#   5. DB 저장
#   6. 중복 스킵
```

### NEW! 카테고리 동적 관리
- 하드코딩 제거
- DB의 Category 테이블에서 읽어옴
- 새 카테고리 추가 → 다음 실행 시 자동 반영

### NEW! Storage 자동 업로드
- **썸네일**: 외부 URL → Supabase Storage 복사
- **AI Tool 로고**: 자동 수집 → Storage 업로드
- 영속성 보장 (외부 링크 깨짐 방지)

### NEW! AI Tool 자동 관리
- 콘텐츠에서 감지된 AI Tool 자동 등록
- 로고 이미지 자동 다운로드 및 업로드
- AITool, ContentAITool 테이블 자동 매칭

---

## 🎯 달성한 기능 (전체)

### ✅ 완전 자동화
- [x] YouTube API 연동 (검색 + 메타데이터 추출)
- [x] Google Custom Search 연동 (블로그 검색)
- [x] Jina.ai Reader 연동 (웹 크롤링)
- [x] Gemini AI 연동 (콘텐츠 분석)
- [x] Supabase 완전 연동 (다중 테이블 자동 처리)
- [x] **자동 실행 크롤러** (백그라운드 서비스)
- [x] **카테고리 동적 로드** (DB 기반)
- [x] **Storage 자동 업로드** (썸네일 + AI Tool 로고)

### ✅ 지능형 분석
- [x] 카테고리 자동 분류 (DB에서 동적 로드)
- [x] AI 도구 자동 감지 및 로고 수집
- [x] 한국어 설명 자동 생성 (~에요체)
- [x] 태그 자동 생성 (#AI활용, #자동화 등)
- [x] 난이도 자동 판정
- [x] 언어 자동 감지
- [x] 예상 소요 시간 자동 계산 (영상/글 구분)

### ✅ 안전성
- [x] 중복 콘텐츠 자동 감지 및 스킵 (sourceUrl 기준)
- [x] 개별 항목 실패해도 나머지 계속 처리
- [x] 상세한 오류 메시지 및 로깅
- [x] 환경 변수 검증

### ✅ 확장성
- [x] 페이지네이션 지원
- [x] 카테고리/난이도/언어별 필터링
- [x] 새로운 AI 도구 자동 등록 (upsert)
- [x] 태그는 항상 신규 생성 (의미 충돌 방지)
- [x] **새 카테고리 추가 시 자동 반영**

### ✅ 운영 편의성
- [x] systemd 서비스 파일 제공
- [x] Docker Compose 설정 제공
- [x] PM2 실행 가이드 제공
- [x] 자동 재시작 지원
- [x] 로그 모니터링 가능

---

## 📂 프로젝트 구조

```
ai-content-collector-mcp-server/
├── package.json              # 프로젝트 메타데이터 및 의존성
├── tsconfig.json             # TypeScript 설정
├── .env.example              # 환경 변수 예시
├── .gitignore                # Git 제외 파일
├── README.md                 # 메인 문서
├── QUICKSTART.md             # 빠른 시작 가이드
├── EXAMPLES.md               # 상세 사용 예시
│
├── src/
│   ├── index.ts              # MCP 서버 메인 엔트리포인트
│   ├── constants.ts          # 공통 상수
│   │
│   ├── types/
│   │   └── index.ts          # TypeScript 타입 정의
│   │
│   ├── schemas/
│   │   └── index.ts          # Zod 검증 스키마
│   │
│   ├── services/
│   │   ├── supabase.ts       # Supabase 클라이언트 및 DB 작업
│   │   ├── scraper.ts        # 웹 스크래핑 (Jina.ai, YouTube)
│   │   ├── analyzer.ts       # AI 분석 (Gemini)
│   │   └── search.ts         # 검색 (YouTube, Google)
│   │
│   └── tools/
│       └── collector.ts      # MCP 도구 구현
│
└── dist/                     # 빌드 결과 (npm run build 후 생성)
    └── index.js              # 실행 파일
```

---

## 🛠 5개의 강력한 MCP 도구

### 1. `ai_content_search_and_collect`
**완전 자동화 메인 도구**
- 검색 → 스크래핑 → 분석 → 저장 일괄 처리
- YouTube + Google 동시 검색 지원
- 중복 자동 스킵
- 부분 실패 시에도 나머지 계속 처리

### 2. `ai_content_scrape_url`
**개별 URL 처리**
- YouTube 동영상 메타데이터 추출
- 블로그/웹사이트 본문 추출
- 자동 타입 감지

### 3. `ai_content_analyze`
**AI 분석 엔진**
- Gemini를 통한 지능형 분석
- 정형화된 메타데이터 생성
- 한국어 자연어 설명 생성

### 4. `ai_content_save_to_supabase`
**DB 저장 엔진**
- 다중 테이블 관계 자동 처리
- Content, Category, AITool, Tag, EstimatedTime, ResultPreview
- 트랜잭션 안전성 보장

### 5. `ai_content_list`
**DB 조회 및 필터링**
- 페이지네이션 지원
- 카테고리/난이도/언어 필터링
- 관계 데이터 자동 조인

---

## 🚀 사용 방법

### 설치 및 설정

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 API 키 입력

# 3. 빌드
npm run build
```

### 모드 1: 자동 크롤러 (추천) 🤖

**완전 자동 백그라운드 실행**

```bash
# 한 번만 실행 (테스트)
npm run crawler:once

# 지속적 실행 (24시간마다 자동 수집)
npm run crawler
```

**서비스화:**
```bash
# systemd
sudo systemctl enable ai-content-crawler
sudo systemctl start ai-content-crawler

# Docker
docker-compose up -d

# PM2
pm2 start dist/crawler.js --name ai-content-crawler
```

👉 **자세한 가이드**: [AUTO_RUN_GUIDE.md](AUTO_RUN_GUIDE.md)

### 모드 2: Claude Desktop 연동 💬

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ai-content-collector": {
      "command": "node",
      "args": ["/절대/경로/ai-content-collector-mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_KEY": "your-key",
        "GEMINI_API_KEY": "your-key",
        "YOUTUBE_API_KEY": "your-key",
        "GOOGLE_API_KEY": "your-key",
        "GOOGLE_CSE_ID": "your-cse-id"
      }
    }
  }
}
```

### 실제 사용 예시

```
You: "ChatGPT 자동화 튜토리얼 5개 찾아서 DB에 넣어줘"

Claude: [검색 → 스크래핑 → 분석 → 저장 자동 실행]
→ ✅ 5개 콘텐츠 자동 수집 완료!
```

---

## 🔑 필요한 API 키

### 필수 (Required)
1. **Supabase** (무료)
   - URL: Project Settings → API
   - Key: anon public key

2. **Gemini API** (무료 할당량)
   - https://makersuite.google.com/app/apikey
   - 분당 60회 요청 가능

### 선택 (검색 기능 사용 시)
3. **YouTube Data API v3** (무료 할당량)
   - Google Cloud Console → YouTube Data API v3
   - 일 10,000 units (검색 1회 = 100 units)

4. **Google Custom Search** (무료 할당량)
   - Google Cloud Console → Custom Search API
   - Programmable Search Engine에서 CSE ID 발급
   - 일 100회 검색

---

## 📊 기술 스택

| 영역 | 기술 |
|------|------|
| **Runtime** | Node.js 20+ |
| **Language** | TypeScript 5.3+ |
| **Framework** | MCP SDK (Model Context Protocol) |
| **Database** | Supabase (PostgreSQL) |
| **AI Analysis** | Google Gemini 1.5 Flash |
| **Web Scraping** | Jina.ai Reader, YouTube oEmbed |
| **Search APIs** | YouTube Data API v3, Google Custom Search |
| **Validation** | Zod |
| **HTTP Client** | Axios |
| **ID Generation** | nanoid |

---

## 🎨 주요 특징

### 1. MCP 베스트 프랙티스 준수
- ✅ 명확한 도구 네이밍 (`ai_content_*` prefix)
- ✅ 상세한 도구 설명 및 파라미터 문서화
- ✅ JSON/Markdown 듀얼 포맷 지원
- ✅ 적절한 tool annotations (readOnly, destructive, idempotent)
- ✅ 에러 처리 및 사용자 친화적 메시지

### 2. 타입 안전성
- ✅ 완전한 TypeScript 타입 커버리지
- ✅ Zod를 통한 런타임 검증
- ✅ 타입 추론 활용

### 3. 확장 가능한 설계
- ✅ 서비스 계층 분리 (scraper, analyzer, search, supabase)
- ✅ 도구 계층 분리 (collector)
- ✅ 타입 및 스키마 중앙 관리
- ✅ 상수 분리

### 4. 프로덕션 준비
- ✅ 환경 변수 검증
- ✅ 에러 처리 및 로깅
- ✅ .gitignore로 보안 파일 제외
- ✅ 명확한 문서화

---

## 📝 다음 단계

### 즉시 시작하기
1. `QUICKSTART.md` 읽기
2. 환경 변수 설정
3. Claude Desktop 연동
4. 첫 번째 콘텐츠 수집!

### 활용 아이디어
- `EXAMPLES.md`에서 10가지 시나리오 확인
- 주간/월간 AI 트렌드 큐레이션
- 학습 경로 자동 구성
- 팀 내부 지식 베이스 구축

---

## 🎓 학습 자료

프로젝트 내 문서:
- `README.md` - 전체 개요 및 기능 설명
- `QUICKSTART.md` - 설치 및 설정 가이드
- `EXAMPLES.md` - 10가지 실제 사용 시나리오
- `.env.example` - 환경 변수 가이드

코드 주석:
- 모든 파일에 상세한 JSDoc 주석
- 함수별 목적과 사용법 설명
- 복잡한 로직에 인라인 주석

---

## 🙏 크레딧

이 프로젝트는 다음 기술들을 활용합니다:
- **MCP (Model Context Protocol)** by Anthropic
- **Jina.ai Reader** for web scraping
- **Google Gemini** for AI analysis
- **Supabase** for database
- **YouTube Data API** & **Google Custom Search** for search

---

## 📄 라이선스

MIT License

---

## 🎉 완성!

**이제 AI 콘텐츠 수집이 완전히 자동화되었습니다!**

Claude에게 "ChatGPT 튜토리얼 찾아줘"라고 말하는 것만으로
검색부터 DB 저장까지 모든 과정이 자동으로 처리됩니다.

**Happy Collecting! 🚀**
