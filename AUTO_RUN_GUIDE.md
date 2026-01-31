# 🤖 자동 실행 가이드

AI Content Collector는 **두 가지 모드**로 실행할 수 있습니다:

1. **MCP 서버 모드** - Claude Desktop과 연동하여 대화로 제어
2. **자동 크롤러 모드** ⭐ - 백그라운드에서 자동으로 콘텐츠 수집

---

## 🎯 자동 크롤러 모드 (추천)

백그라운드에서 주기적으로 자동 실행되는 크롤러입니다.

### 작동 방식

1. **DB에서 카테고리 자동 로드**
   - Category 테이블의 모든 카테고리 읽기
   - 새 카테고리 추가 시 자동 반영

2. **각 카테고리별 자동 수집**
   - 카테고리별로 설정된 개수만큼 콘텐츠 수집
   - 검색 → 스크래핑 → AI 분석 → DB 저장

3. **Storage 자동 업로드**
   - 썸네일 → `contents_thumbnail` 버킷
   - AI Tool 로고 → `ai-tool-logos` 버킷

4. **중복 자동 스킵**
   - sourceUrl 기준 중복 체크
   - 이미 있는 콘텐츠는 건너뜀

5. **주기적 반복**
   - 설정된 간격(기본 24시간)마다 자동 실행

---

## 🚀 실행 방법

### 방법 1: 직접 실행 (간단한 테스트)

```bash
# 한 번만 실행
npm run crawler:once

# 지속적으로 실행 (24시간마다 반복)
npm run crawler
```

### 방법 2: systemd 서비스 (Linux 서버, 권장)

서버 부팅 시 자동 시작되고 크래시 시 자동 재시작됩니다.

#### 1. 서비스 파일 설정

```bash
# 서비스 파일 편집
nano ai-content-crawler.service

# 다음 항목 수정:
# - User=your-username (실제 사용자명)
# - WorkingDirectory=/절대/경로 (실제 경로)
# - ExecStart=/절대/경로 (실제 경로)
# - Environment 변수들 (실제 API 키)
```

#### 2. systemd에 등록

```bash
# 서비스 파일 복사
sudo cp ai-content-crawler.service /etc/systemd/system/

# systemd 리로드
sudo systemctl daemon-reload

# 서비스 활성화 (부팅 시 자동 시작)
sudo systemctl enable ai-content-crawler

# 서비스 시작
sudo systemctl start ai-content-crawler

# 상태 확인
sudo systemctl status ai-content-crawler

# 로그 확인
sudo journalctl -u ai-content-crawler -f
```

#### 3. 서비스 관리

```bash
# 중지
sudo systemctl stop ai-content-crawler

# 재시작
sudo systemctl restart ai-content-crawler

# 비활성화 (부팅 시 자동 시작 해제)
sudo systemctl disable ai-content-crawler
```

### 방법 3: Docker Compose (권장, 격리된 환경)

Docker 컨테이너로 실행하여 시스템과 격리합니다.

#### 1. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 실제 API 키 입력
nano .env
```

#### 2. Docker 실행

```bash
# 빌드 및 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 재시작
docker-compose restart
```

### 방법 4: PM2 (Node.js 프로세스 매니저)

```bash
# PM2 설치
npm install -g pm2

# 크롤러 시작
pm2 start dist/crawler.js --name ai-content-crawler

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status

# 로그 확인
pm2 logs ai-content-crawler

# 중지
pm2 stop ai-content-crawler

# 재시작
pm2 restart ai-content-crawler
```

---

## ⚙️ 설정 옵션

### 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `ITEMS_PER_CATEGORY` | 5 | 각 카테고리별 수집 개수 |
| `CRAWL_INTERVAL_HOURS` | 24 | 크롤링 반복 주기 (시간) |
| `RUN_ONCE` | false | true면 한 번만 실행 후 종료 |

### 예시

```bash
# 각 카테고리별 10개씩, 12시간마다
ITEMS_PER_CATEGORY=10 CRAWL_INTERVAL_HOURS=12 npm run crawler

# 각 카테고리별 3개씩, 한 번만 실행
ITEMS_PER_CATEGORY=3 RUN_ONCE=true npm run crawler
```

---

## 📊 실행 결과 확인

### 콘솔 출력

```
╔════════════════════════════════════════╗
║   AI Content Collector - Auto Crawler  ║
╚════════════════════════════════════════╝

🚀 Starting AI Content Crawler
⏰ Time: 2026-01-19T12:00:00.000Z
📊 Items per category: 5

✅ Supabase initialized

📋 Found 4 categories in database:
  - 바이브 코딩
  - 이미지 생성
  - 텍스트 생성
  - 영상 생성

📂 Crawling category: 바이브 코딩
Target: 5 items
🔍 Search query: "AI coding tutorial programming"
Found 10 search results

  📄 Processing: How to use AI for coding automation...
  📥 Scraping...
  🤖 Analyzing with AI...
  💾 Saving to database...
  ✅ Saved! ID: CONTENTS-00123
  📊 Difficulty: INTERMEDIATE | Tools: ChatGPT, Cursor

✅ Category "바이브 코딩" completed: 5/5 items saved

...

📊 ═══════════════════════════════════════
           CRAWL STATISTICS
═══════════════════════════════════════
🔍 Total Searched:        40
📥 Total Scraped:         20
🤖 Total Analyzed:        20
💾 Total Saved:           20
⏭️  Duplicates Skipped:   8
❌ Errors:                0
═══════════════════════════════════════

✅ Crawler completed successfully
⏰ Next run scheduled in 24 hours
```

### Supabase에서 확인

1. [supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택
3. **Table Editor** → **Content** 테이블
4. 새로 추가된 데이터 확인

### Storage 확인

1. **Storage** → **contents_thumbnail**
   - 콘텐츠 썸네일 이미지 확인

2. **Storage** → **ai-tool-logos**
   - AI 도구 로고 이미지 확인

---

## 🎨 카테고리 추가 방법

### 1. Supabase에서 직접 추가

```sql
-- Category 테이블에 새 카테고리 추가
INSERT INTO "Category" (id, name, slug, "iconUrl")
VALUES 
  ('cat-xyz123', '프롬프트 엔지니어링', 'prompt-engineering', NULL);
```

### 2. 자동 반영

다음 크롤링 실행 시 자동으로 새 카테고리 감지하여 수집 시작!

---

## 🔧 트러블슈팅

### 크롤러가 시작되지 않음

```bash
# 환경 변수 확인
echo $SUPABASE_URL
echo $GEMINI_API_KEY

# 빌드 확인
npm run build

# 수동 실행으로 오류 확인
npm run crawler:once
```

### 중복 콘텐츠만 계속 나옴

- 검색 쿼리가 너무 일반적일 수 있음
- `src/crawler.ts`의 `generateSearchQuery()` 함수 수정
- 더 구체적인 검색어 사용

### API 할당량 초과

```
Error: YouTube API quota exceeded
```

**해결:**
- CRAWL_INTERVAL_HOURS 증가 (예: 48시간)
- ITEMS_PER_CATEGORY 감소 (예: 3개)
- API 키 추가 발급

### Storage 업로드 실패

- Supabase Storage 버킷 존재 확인
  - `contents_thumbnail` (PUBLIC)
  - `ai-tool-logos` (PUBLIC)
- RLS 정책 확인 (anon 역할에 INSERT 권한)

---

## 💡 Pro Tips

### Tip 1: 단계적 실행

```bash
# 1단계: 테스트 (1개씩만 수집)
ITEMS_PER_CATEGORY=1 RUN_ONCE=true npm run crawler

# 2단계: 확인 후 증가
ITEMS_PER_CATEGORY=5 RUN_ONCE=true npm run crawler

# 3단계: 자동화
npm run crawler
```

### Tip 2: 로그 모니터링

```bash
# systemd
sudo journalctl -u ai-content-crawler -f

# Docker
docker-compose logs -f

# PM2
pm2 logs ai-content-crawler --lines 100
```

### Tip 3: 크론잡으로 백업

```bash
# 매일 새벽 3시에 한 번씩 실행
0 3 * * * cd /path/to/ai-content-collector-mcp-server && npm run crawler:once
```

### Tip 4: 알림 설정

크롤링 완료/실패 시 알림 받기 (Slack, Discord 등)
→ `src/crawler.ts`의 `runCrawler()` 함수 끝에 웹훅 추가

---

## 🎉 완성!

이제 **완전 자동화**되었습니다!

- ✅ 서버 부팅 시 자동 시작
- ✅ 크래시 시 자동 재시작
- ✅ 주기적으로 자동 수집
- ✅ 새 카테고리 자동 반영
- ✅ 중복 자동 스킵
- ✅ Storage 자동 업로드

**설정만 하면 손 댈 필요 없이 계속 콘텐츠가 쌓입니다! 🚀**
