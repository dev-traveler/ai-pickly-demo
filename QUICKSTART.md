# 🚀 빠른 시작 가이드

## 1단계: 환경 설정

### 1.1 저장소 클론 또는 다운로드

```bash
# 프로젝트 디렉토리로 이동
cd ai-content-collector-mcp-server
```

### 1.2 의존성 설치

```bash
npm install
```

### 1.3 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 편집
nano .env  # 또는 원하는 에디터 사용
```

**필수 변수:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-key
```

**선택 변수 (검색 기능 사용 시):**
```env
YOUTUBE_API_KEY=your-youtube-key
GOOGLE_API_KEY=your-google-key
GOOGLE_CSE_ID=your-cse-id
```

### 1.4 빌드

```bash
npm run build
```

## 2단계: Claude Desktop 연동

### 2.1 설정 파일 위치

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### 2.2 설정 추가

```json
{
  "mcpServers": {
    "ai-content-collector": {
      "command": "node",
      "args": [
        "/절대/경로/ai-content-collector-mcp-server/dist/index.js"
      ],
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

⚠️ **주의:**
- `args`의 경로는 **절대 경로**를 사용하세요
- 예: `/Users/yourname/projects/ai-content-collector-mcp-server/dist/index.js`

### 2.3 Claude Desktop 재시작

설정 파일을 수정한 후 Claude Desktop을 완전히 종료하고 다시 시작하세요.

## 3단계: 사용 시작!

### 예시 1: 자동 콘텐츠 수집

Claude에게 이렇게 요청하세요:

```
"ChatGPT 자동화 튜토리얼 5개 찾아서 DB에 저장해줘"
```

Claude가 자동으로:
1. YouTube와 Google에서 검색
2. 각 콘텐츠 스크래핑
3. AI로 분석 및 분류
4. Supabase에 저장
5. 결과 요약

### 예시 2: 특정 URL 처리

```
"이 YouTube 영상 분석해서 저장해줘: https://youtube.com/watch?v=..."
```

### 예시 3: DB 조회

```
"지금까지 수집한 AI 활용 콘텐츠 10개 보여줘"
```

## 4단계: 결과 확인

### Supabase Dashboard에서 확인

1. [supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택
3. Table Editor → Content 테이블 확인

### Claude에서 직접 확인

```
"최근에 저장된 콘텐츠 5개 보여줘"
```

---

## 🎯 주요 사용 패턴

### Pattern 1: 주제별 자동 수집

```
"AI 이미지 생성 튜토리얼 10개 찾아서 저장"
"Cursor 사용법 관련 영상 5개 수집"
"ChatGPT API 활용 블로그 글 찾아줘"
```

### Pattern 2: 소스 지정 검색

```
"YouTube에서만 MidJourney 튜토리얼 3개 찾아줘"
"블로그 글 위주로 프롬프트 엔지니어링 자료 수집"
```

### Pattern 3: 분석만 (저장 안 함)

```
"이 URL 분석만 해줘, 저장은 안 해도 돼"
→ auto_save=false 옵션 사용
```

### Pattern 4: 필터링 조회

```
"초보자용 한국어 콘텐츠만 보여줘"
→ difficulty=BEGINNER, language=KO

"바이브 코딩 카테고리만 조회"
→ category="바이브 코딩"
```

---

## 🔧 문제 해결

### "MCP server not found" 오류

1. `claude_desktop_config.json` 파일 위치 확인
2. JSON 문법 오류 확인 (쉼표, 중괄호 등)
3. `dist/index.js` 경로가 절대 경로인지 확인
4. Claude Desktop 완전히 재시작

### "Missing environment variables" 오류

1. `.env` 파일이 있는지 확인
2. 필수 변수(SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY) 설정 확인
3. `claude_desktop_config.json`의 `env` 섹션에도 변수가 있는지 확인

### 검색 결과가 없음

1. YOUTUBE_API_KEY와 GOOGLE_API_KEY 설정 확인
2. API 할당량 초과 여부 확인
3. 검색 쿼리를 더 구체적으로 변경

### Supabase 저장 오류

1. Supabase 프로젝트가 활성화되어 있는지 확인
2. 데이터베이스 스키마가 올바르게 생성되었는지 확인
3. anon 키에 필요한 권한이 있는지 확인

---

## 📚 다음 단계

- [상세 사용 예시](EXAMPLES.md) 보기
- [API 레퍼런스](API.md) 확인
- 이슈 발생 시 GitHub Issues에 보고

---

**이제 자동화된 AI 콘텐츠 수집을 시작하세요! 🎉**
