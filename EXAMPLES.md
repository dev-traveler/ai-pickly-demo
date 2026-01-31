# 📚 상세 사용 예시

이 문서는 AI Content Collector MCP Server의 다양한 활용 시나리오를 보여줍니다.

---

## 시나리오 1: 주간 AI 뉴스 큐레이션

### 목표
매주 최신 AI 도구와 튜토리얼을 자동으로 수집

### Claude와의 대화

**You:**
```
이번 주 새로 나온 AI 도구 튜토리얼 10개 찾아서 저장해줘.
YouTube랑 블로그 둘 다 검색해줘.
```

**Claude:**
```
[ai_content_search_and_collect 도구 사용]
query: "AI tools tutorial 2025 new"
source: "both"
limit: 10
auto_save: true
```

**결과:**
- YouTube 비디오 5개, 블로그 글 5개 자동 수집
- 각 콘텐츠 AI 분석 완료
- Supabase에 자동 저장
- 카테고리, 태그, 난이도 자동 분류

---

## 시나리오 2: 특정 AI 도구 심화 학습

### 목표
Cursor 에디터 관련 고급 튜토리얼만 모으기

### Claude와의 대화

**You:**
```
Cursor 에디터 고급 사용법 영상을 YouTube에서 5개 찾아줘.
초보자용은 빼고.
```

**Claude:**
```
[ai_content_search_and_collect 도구 사용]
query: "Cursor editor advanced tutorial"
source: "youtube"
limit: 5
auto_save: true

→ 결과를 분석하여 BEGINNER 난이도는 필터링
→ INTERMEDIATE, ADVANCED만 저장
```

**활용:**
- DB에서 조회 시 `difficulty=ADVANCED` 필터 사용
- Cursor 관련 콘텐츠만 모아서 학습 플랜 수립

---

## 시나리오 3: 기존 콘텐츠 재분석

### 목표
수동으로 수집했던 콘텐츠를 AI로 재분석

### Claude와의 대화

**You:**
```
이 URL들 분석만 해줘, 저장은 내가 나중에 할게:

1. https://youtube.com/watch?v=abc123
2. https://medium.com/@user/ai-automation-guide
```

**Claude:**
```
[각 URL에 대해]
1. ai_content_scrape_url 실행
2. ai_content_analyze 실행
3. 결과 요약 제공 (저장 안 함)

→ 분석 결과 확인 후 원하는 것만 저장 가능
```

---

## 시나리오 4: 카테고리별 콘텐츠 관리

### 목표
각 카테고리별로 균형있게 콘텐츠 수집

### Claude와의 대화

**You (Day 1):**
```
바이브 코딩 카테고리 콘텐츠가 몇 개나 있어?
```

**Claude:**
```
[ai_content_list 사용]
category: "바이브 코딩"
→ 현재 15개
```

**You:**
```
그럼 AI 활용 카테고리도 15개 맞춰서 채워줘
```

**Claude:**
```
[ai_content_list로 현재 개수 확인]
→ AI 활용: 8개

[ai_content_search_and_collect 실행]
query: "AI productivity automation tutorial"
source: "both"
limit: 7
→ 딱 7개 추가하여 균형 맞춤
```

---

## 시나리오 5: 다국어 콘텐츠 수집

### 목표
한국어와 영어 콘텐츠를 모두 수집

### Claude와의 대화

**You:**
```
ChatGPT API 사용법을 한국어로 설명한 자료 5개,
영어로 된 공식 문서스타일 자료 5개 찾아줘
```

**Claude:**
```
[1차 검색 - 한국어]
query: "ChatGPT API 사용법 한국어"
source: "both"
limit: 5

[2차 검색 - 영어]
query: "ChatGPT API official documentation tutorial"
source: "both"
limit: 5

→ AI 분석 시 자동으로 language=KO, EN 분류
→ 총 10개 콘텐츠 수집 완료
```

---

## 시나리오 6: 중복 방지 및 품질 관리

### 목표
이미 수집한 콘텐츠는 건너뛰고 새로운 것만 추가

### Claude와의 대화

**You:**
```
MidJourney 튜토리얼 20개 수집해줘.
이미 있는 건 자동으로 건너뛰게.
```

**Claude:**
```
[ai_content_search_and_collect 실행]
query: "MidJourney tutorial"
limit: 20

→ 각 URL에 대해 checkDuplicateContent() 자동 실행
→ 이미 DB에 있는 URL은 건너뜀
→ 새로운 콘텐츠만 분석 및 저장

결과: 20개 검색 → 12개는 중복 → 8개만 새로 저장
```

---

## 시나리오 7: 태그 기반 콘텐츠 발견

### 목표
특정 태그로 콘텐츠 찾고 유사한 것 더 수집

### Claude와의 대화

**You:**
```
#워크플로우자동화 태그가 있는 콘텐츠 보여줘
```

**Claude:**
```
[ai_content_list 사용]
→ Tag 테이블 조인하여 검색
→ 5개 발견
```

**You:**
```
이런 스타일로 5개 더 찾아줘
```

**Claude:**
```
→ 기존 콘텐츠의 aiTools, category 패턴 분석
→ 유사한 검색 쿼리 생성
→ 추가 콘텐츠 수집
```

---

## 시나리오 8: 배치 처리

### 목표
여러 주제를 한 번에 수집

### Claude와의 대화

**You:**
```
다음 주제들로 각각 3개씩 콘텐츠 수집해줘:
1. GitHub Copilot 사용법
2. Stable Diffusion 프롬프트 작성
3. AI 음성 생성
```

**Claude:**
```
[순차적으로 실행]

1. ai_content_search_and_collect
   query: "GitHub Copilot tutorial"
   limit: 3

2. ai_content_search_and_collect
   query: "Stable Diffusion prompt writing"
   limit: 3

3. ai_content_search_and_collect
   query: "AI voice generation tutorial"
   limit: 3

→ 총 9개 콘텐츠 자동 수집 완료
```

---

## 시나리오 9: 학습 경로 구성

### 목표
초보자를 위한 단계별 학습 자료 구성

### Claude와의 대화

**You:**
```
AI 이미지 생성을 배우고 싶은 완전 초보자를 위해
단계별 콘텐츠를 추천해줘
```

**Claude:**
```
[1단계: 초보자 콘텐츠 수집]
query: "AI image generation beginner tutorial"
limit: 5
→ AI 분석 시 BEGINNER로 자동 분류

[2단계: 중급 콘텐츠 수집]
query: "AI image generation intermediate techniques"
limit: 5
→ INTERMEDIATE로 분류

[3단계: 고급 콘텐츠 수집]
query: "AI image generation advanced tips"
limit: 5
→ ADVANCED로 분류

[4단계: 학습 경로 제시]
난이도별로 정렬하여 순서대로 학습 가이드 제공
```

---

## 시나리오 10: 정기 업데이트 자동화

### 목표
매주 자동으로 새 콘텐츠 수집 (수동 트리거)

### 매주 월요일 Claude와의 대화

**You:**
```
이번 주 AI 트렌드 업데이트 해줘.
각 카테고리별로 2개씩.
```

**Claude:**
```
[카테고리별 검색 및 수집]

바이브 코딩:
query: "coding AI tools new"
limit: 2

AI 활용:
query: "AI productivity automation latest"
limit: 2

시각 디자인:
query: "AI design tools new"
limit: 2

디지털 마케팅:
query: "AI marketing automation tutorial"
limit: 2

→ 총 8개 최신 콘텐츠 자동 수집
→ 이미 있는 건 자동 스킵
```

---

## 💡 Pro Tips

### Tip 1: 구체적인 검색어 사용
❌ "AI 튜토리얼"
✅ "ChatGPT 블로그 글 자동 작성 튜토리얼"

### Tip 2: 소스 지정으로 품질 관리
- YouTube: 영상 튜토리얼 선호 시
- Google: 상세한 문서/가이드 선호 시
- Both: 다양한 형식 수집 시

### Tip 3: 분석만 먼저 해보기
`auto_save=false`로 분석 결과 확인 후 저장 여부 결정

### Tip 4: 정기적인 중복 검사
시스템이 자동으로 중복을 걸러내므로 걱정 없이 수집 가능

### Tip 5: 카테고리 균형 유지
주기적으로 `ai_content_list`로 카테고리별 개수 확인

---

**더 많은 활용법을 발견하시면 Issues에 공유해주세요!**
