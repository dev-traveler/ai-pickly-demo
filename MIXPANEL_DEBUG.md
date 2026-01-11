# Mixpanel 로그 디버깅 가이드

## 문제 확인 체크리스트

### 1. 환경 변수 확인

`.env.local` 파일에 Mixpanel 토큰이 설정되어 있는지 확인:

```bash
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_project_token
```

**중요**: `NEXT_PUBLIC_` 접두사가 반드시 필요합니다. 이것이 없으면 브라우저에서 접근할 수 없습니다.

### 2. 브라우저 콘솔 확인

개발 서버를 실행한 후 브라우저 개발자 도구 콘솔에서 다음을 확인:

```
[Mixpanel] ✅ Initialized successfully
[Mixpanel] Debug mode: true
```

이 메시지가 보이지 않으면:
- `[Mixpanel] ⚠️  Token not found` → 환경 변수 확인
- 아무 메시지도 없음 → `MixpanelProvider`가 렌더링되지 않음

### 3. 이벤트 트래킹 확인

페이지에서 인터랙션(클릭, 검색 등) 시 콘솔에 다음과 같은 로그가 보여야 합니다:

```
[Mixpanel] 📄 Tracking: pageview@home {page_name: "home"}
[Mixpanel] 🖱️  Tracking: click@button {object_section: "body", object_id: "..."}
[Mixpanel] 👁️  Tracking: impression@content_card {object_id: "...", object_position: 0}
```

로그가 보이지 않으면:
- `[Mixpanel] Not initialized. Skipping ...` → 초기화 실패
- 아무 로그도 없음 → 이벤트 핸들러가 호출되지 않음

### 4. Mixpanel 대시보드 확인

1. Mixpanel 대시보드 접속: https://mixpanel.com
2. Live View 탭으로 이동
3. 실시간으로 이벤트가 들어오는지 확인

**주의**: 이벤트는 즉시 표시되지 않을 수 있습니다 (1-2분 지연 가능)

## 일반적인 문제와 해결

### 문제 1: "Token not found" 경고

**원인**: 환경 변수가 설정되지 않음

**해결**:
```bash
# .env.local 파일 생성 또는 수정
echo "NEXT_PUBLIC_MIXPANEL_TOKEN=your_token_here" >> .env.local

# 개발 서버 재시작
npm run dev
```

### 문제 2: 초기화는 되지만 이벤트가 전송되지 않음

**원인**: Mixpanel 토큰이 잘못되었거나 프로젝트 설정 문제

**해결**:
1. Mixpanel 대시보드에서 프로젝트 설정 확인
2. Project Token이 올바른지 확인
3. 브라우저 네트워크 탭에서 `api.mixpanel.com`으로 요청이 가는지 확인

### 문제 3: 일부 이벤트만 전송됨

**원인**: 특정 컴포넌트에서 트래킹 함수 호출이 누락됨

**해결**:
1. 해당 컴포넌트의 이벤트 핸들러 확인
2. `trackClick`, `trackImpression` 등이 올바르게 import 되었는지 확인
3. 콘솔 로그로 함수가 실제로 호출되는지 확인

### 문제 4: 프로덕션에서만 작동하지 않음

**원인**: 환경 변수가 프로덕션 환경에 설정되지 않음

**해결**:
1. Vercel/Netlify 등 배포 플랫폼의 환경 변수 설정 확인
2. `NEXT_PUBLIC_MIXPANEL_TOKEN`이 설정되어 있는지 확인
3. 빌드 후 재배포

## 디버그 모드 비활성화

프로덕션에서는 자동으로 디버그 로그가 비활성화됩니다.

개발 환경에서 로그를 줄이고 싶다면:

```typescript
// lib/analytics/mixpanel.ts
const ENABLE_CONSOLE_LOGS = false; // 이 값을 false로 변경

// 각 함수에서:
if (ENABLE_CONSOLE_LOGS) {
  console.log(`[Mixpanel] ...`);
}
```

## 이벤트 명명 규칙

모든 이벤트는 `{action}@{object_type}` 형식을 따릅니다:

- `pageview@home` - 홈 페이지 조회
- `click@button` - 버튼 클릭
- `impression@content_card` - 콘텐츠 카드 노출
- `hover@tool_logo` - AI 툴 로고 호버
- `search@keyword` - 키워드 검색
- `input@email` - 이메일 입력
- `close@modal` - 모달 닫기

## 추가 도움이 필요한 경우

1. 브라우저 콘솔의 전체 로그 캡처
2. Mixpanel 프로젝트 설정 스크린샷
3. 네트워크 탭에서 `mixpanel.com` 관련 요청/응답 확인
