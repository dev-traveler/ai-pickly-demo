# Mixpanel 설정 가이드

AI Pickly 프로젝트에 Mixpanel 분석이 통합되어 있습니다.

## 1. Mixpanel 프로젝트 토큰 발급

1. [Mixpanel](https://mixpanel.com)에 로그인합니다
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다
3. **Project Settings** > **Project Token**에서 토큰을 복사합니다

## 2. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가하세요:

```bash
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_project_token
```

## 3. 구현된 이벤트 목록

### Pageview 이벤트
- 자동으로 페이지 전환 시 추적됩니다
- 이벤트명: `pageview@{page_name}`
- 예: `pageview@home`, `pageview@policy_privacy`

### Onboarding 모달
- `impression@onboarding` - 온보딩 모달 표시
- `click@button` - 이전/다음 버튼 클릭
- `click@button` - "AI Pickly 사용하기" 클릭
- `click@button` - "건너뛰기" 클릭
- `close@modal` - 온보딩 모달 닫기

### Content Card
- `impression@content_card` - 콘텐츠 카드가 화면에 50% 이상 보일 때
- `hover@tool_logo` - AI 도구 로고에 마우스 hover
- `click@content_card` - 콘텐츠 카드 클릭

### Header & Search
- `search@keyword` - 검색어 입력 후 Enter
- `click@button` - "AI 뉴스레터 구독" 버튼 클릭

### Newsletter 구독 Dialog
- `input@email` - 이메일 입력
- `click@button` - "무료 구독 시작하기" 버튼 클릭
- `click@link` - 구독 취소, 개인정보처리방침, 마케팅 정보 수신 링크 클릭
- `close@modal` - 뉴스레터 모달 닫기

## 4. 이벤트 속성 (Event Properties)

모든 이벤트는 다음 공통 속성을 포함합니다:

- `page_name` - 현재 페이지 이름 (예: "home")
- `object_section` - 이벤트가 발생한 섹션 (예: "header", "body")
- `object_type` - 객체 타입 (예: "button", "link", "modal")
- `object_id` - 객체 고유 ID
- `object_name` - 객체 이름 (사용자에게 보이는 텍스트)
- `object_position` - 객체 위치 (인덱스, 0부터 시작)

## 5. 추가 이벤트 구현 방법

새로운 이벤트를 추가하려면 `lib/analytics/mixpanel.ts`의 함수를 사용하세요:

```typescript
import { trackClick, trackImpression, trackHover } from "@/lib/analytics/mixpanel";

// 버튼 클릭 추적
trackClick("button", {
  page_name: "home",
  object_section: "header",
  object_id: "my_button",
  object_name: "버튼 이름",
});

// Impression 추적
trackImpression("content_card", {
  page_name: "home",
  object_section: "body",
  object_id: content.id,
  object_name: content.title,
  object_position: index,
});

// Hover 추적
trackHover("tool_logo", {
  page_name: "home",
  object_section: "body",
  object_id: toolId,
  object_name: toolName,
  object_position: position,
});
```

## 6. 디버깅

개발 환경에서는 Mixpanel이 자동으로 디버그 모드로 실행됩니다. 브라우저 콘솔에서 전송된 이벤트를 확인할 수 있습니다.

```bash
npm run dev
```

콘솔에서 `Mixpanel:` 로 시작하는 로그를 확인하세요.

## 7. 프로덕션 배포

프로덕션 환경에서는 Vercel 환경 변수에 `NEXT_PUBLIC_MIXPANEL_TOKEN`을 추가하세요:

1. Vercel Dashboard > 프로젝트 선택
2. Settings > Environment Variables
3. `NEXT_PUBLIC_MIXPANEL_TOKEN` 추가
4. 재배포
