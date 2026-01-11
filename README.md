# AI Pickly

AI 도구 튜토리얼 큐레이션 플랫폼

## 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 입력하세요:

```bash
cp .env.example .env
```

필수 환경 변수:
- `DATABASE_URL`: Supabase PostgreSQL 연결 URL (connection pooling)
- `DIRECT_URL`: Supabase PostgreSQL 직접 연결 URL (마이그레이션용)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 역할 키 (서버 사이드용)
- `NEXT_PUBLIC_MIXPANEL_TOKEN`: Mixpanel 프로젝트 토큰

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

Prisma 마이그레이션을 실행하여 데이터베이스 스키마를 생성합니다:

```bash
npx prisma migrate dev
```

샘플 데이터를 추가하려면 시드 스크립트를 실행하세요:

```bash
npm run db:seed
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 명령어

### 개발 서버
```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 실행
```

### 데이터베이스 관리
```bash
# Prisma 기본 명령어
npx prisma migrate dev        # 개발 환경에서 마이그레이션 실행
npx prisma studio             # Prisma Studio (DB GUI) 실행
npx prisma generate           # Prisma Client 생성

# 데이터 마이그레이션 (CSV → DB)
npm run db:migrate-contents   # contents_data_final.csv를 Content 테이블로 마이그레이션
npm run db:migrate-aitools    # aitool_db.csv를 AITool 테이블로 마이그레이션
npm run db:seed               # 샘플 데이터 시드

# 썸네일 관리 (Supabase Storage)
npm run db:sync-thumbnails    # Supabase Storage의 파일을 DB와 동기화
npm run db:update-thumbnails  # 외부 URL을 Supabase Storage URL로 교체
npm run db:check-thumbnails   # 썸네일 URL 상태 확인
npm run db:check-storage      # Supabase Storage 버킷 확인
```

### 초기 데이터 설정 (처음 한 번만 실행)
팀원이 처음 프로젝트를 클론한 후:
```bash
# 1. 의존성 설치
npm install

# 2. DB 스키마 생성
npx prisma migrate dev

# 3. CSV 데이터 마이그레이션 (CSV 파일이 있는 경우)
npm run db:migrate-aitools    # AI Tools 먼저
npm run db:migrate-contents   # Contents 나중에 (AI Tools 참조)

# 4. Supabase Storage 썸네일 동기화 (선택사항)
npm run db:sync-thumbnails

# 5. 개발 서버 실행
npm run dev
```

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **State Management**: TanStack Query, nuqs (URL state)
- **Analytics**: Mixpanel
- **UI Components**: Radix UI, shadcn/ui

## 프로젝트 구조

```
├── app/                    # Next.js App Router 페이지
│   ├── (main)/            # 메인 레이아웃 그룹
│   └── Providers.tsx      # 클라이언트 프로바이더
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── providers/        # 프로바이더 컴포넌트
│   └── onboarding/       # 온보딩 관련 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── db/               # Prisma 쿼리 (Server Actions)
│   ├── analytics/        # Mixpanel 설정
│   └── utils.ts          # 공통 유틸리티
├── prisma/               # Prisma 설정
│   ├── schema.prisma     # 데이터베이스 스키마
│   ├── seed.ts           # 시드 데이터
│   └── migrations/       # 마이그레이션 파일
├── hooks/                # Custom React Hooks
└── types/                # TypeScript 타입 정의
```

## 데이터베이스 스키마

주요 모델:
- `Content`: 튜토리얼 콘텐츠
- `AITool`: AI 도구 정보
- `Category`: 카테고리
- `Tag`: 태그
- `NewsletterSubscriber`: 뉴스레터 구독자

자세한 스키마는 `prisma/schema.prisma`를 참조하세요.

## Analytics

Mixpanel을 사용하여 사용자 행동을 추적합니다. 설정 방법은 `MIXPANEL_SETUP.md`를, 디버깅은 `MIXPANEL_DEBUG.md`를 참조하세요.

## 배포

Vercel에서 자동 배포됩니다. 환경 변수를 Vercel 프로젝트 설정에 추가해야 합니다.

## 라이선스

MIT
