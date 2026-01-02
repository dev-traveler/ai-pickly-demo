import { PrismaClient, Difficulty, Language, TimeType, PreviewType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'marketing' },
      update: {},
      create: {
        id: 'cat-1',
        name: '마케팅',
        slug: 'marketing',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        id: 'cat-2',
        name: '디자인',
        slug: 'design',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'document' },
      update: {},
      create: {
        id: 'cat-3',
        name: '문서 작성',
        slug: 'document',
      },
    }),
  ])

  console.log('✅ Created categories:', categories.length)

  // Create AI tools
  const tools = await Promise.all([
    prisma.aITool.upsert({
      where: { slug: 'chatgpt' },
      update: {},
      create: {
        id: 'tool-1',
        name: 'ChatGPT',
        slug: 'chatgpt',
        websiteUrl: 'https://chat.openai.com',
        description: 'OpenAI의 대화형 AI 모델',
      },
    }),
    prisma.aITool.upsert({
      where: { slug: 'midjourney' },
      update: {},
      create: {
        id: 'tool-2',
        name: 'Midjourney',
        slug: 'midjourney',
        websiteUrl: 'https://www.midjourney.com',
        description: 'AI 이미지 생성 도구',
      },
    }),
    prisma.aITool.upsert({
      where: { slug: 'notion-ai' },
      update: {},
      create: {
        id: 'tool-3',
        name: 'Notion AI',
        slug: 'notion-ai',
        websiteUrl: 'https://www.notion.so/product/ai',
        description: 'Notion의 AI 작성 도우미',
      },
    }),
  ])

  console.log('✅ Created AI tools:', tools.length)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'beginner-friendly' },
      update: {},
      create: {
        id: 'tag-1',
        name: '초보자 추천',
        slug: 'beginner-friendly',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'productivity' },
      update: {},
      create: {
        id: 'tag-2',
        name: '생산성',
        slug: 'productivity',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'free' },
      update: {},
      create: {
        id: 'tag-3',
        name: '무료',
        slug: 'free',
      },
    }),
  ])

  console.log('✅ Created tags:', tags.length)

  // Create 5 content items
  const contents = [
    {
      id: 'content-1',
      title: 'ChatGPT로 블로그 포스트 3분 만에 작성하기',
      description: 'ChatGPT를 활용해 SEO 최적화된 블로그 글을 빠르게 작성하는 방법을 알려드립니다. 초보자도 따라할 수 있는 단계별 가이드입니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-blog',
      publishedAt: new Date('2024-12-15'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 180,
        displayMinutes: 3,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '프롬프트 예시: "SEO 최적화된 1000자 블로그 글 작성해줘. 주제: AI 도구 활용법"',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '결과: 완성도 높은 블로그 초안을 3분 안에 받을 수 있습니다.',
        },
      ],
    },
    {
      id: 'content-2',
      title: 'Midjourney로 SNS 썸네일 디자인하기',
      description: '디자인 경험이 없어도 Midjourney를 사용하면 전문가 수준의 SNS 썸네일을 만들 수 있습니다. 프롬프트 작성법부터 결과물까지!',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-thumbnail',
      publishedAt: new Date('2024-12-10'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 300,
        displayMinutes: 5,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '프롬프트: "professional youtube thumbnail, tech review, 16:9, vibrant colors --ar 16:9"',
        },
      ],
    },
    {
      id: 'content-3',
      title: 'Notion AI로 회의록 자동 정리하기',
      description: '회의 내용을 Notion에 메모하고 AI를 활용해 자동으로 요약하고 액션 아이템을 추출하는 방법을 소개합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/notion-ai-meeting',
      publishedAt: new Date('2024-12-05'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[2].id], // Notion AI
      tags: [tags[0].id, tags[1].id, tags[2].id], // 초보자 추천, 생산성, 무료
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 120,
        displayMinutes: 2,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '회의 내용을 입력하고 "요약해줘" 명령만으로 핵심 내용 추출',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '액션 아이템 자동 분류 및 담당자 할당 가능',
        },
      ],
    },
    {
      id: 'content-4',
      title: 'ChatGPT로 이메일 답장 템플릿 만들기',
      description: '반복적인 이메일 답장에 시간을 낭비하지 마세요. ChatGPT를 활용한 이메일 자동화 노하우를 공유합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-email',
      publishedAt: new Date('2024-11-28'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 240,
        displayMinutes: 4,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '상황별 이메일 템플릿 10가지 즉시 생성',
        },
      ],
    },
    {
      id: 'content-5',
      title: 'Midjourney 프롬프트 작성법 완벽 가이드',
      description: '원하는 이미지를 정확하게 생성하기 위한 Midjourney 프롬프트 작성 팁과 파라미터 활용법을 상세히 설명합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-guide',
      publishedAt: new Date('2024-11-20'),
      language: Language.KO,
      difficulty: Difficulty.ADVANCED,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 600,
        displayMinutes: 10,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '파라미터 완벽 가이드: --ar, --chaos, --quality, --style 등',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '스타일별 프롬프트 예시 30개 포함',
        },
      ],
    },
    {
      id: 'content-6',
      title: 'ChatGPT로 SNS 카피라이팅 10배 빠르게 하기',
      description: '인스타그램, 페이스북, 트위터에 맞는 매력적인 카피를 ChatGPT로 빠르게 작성하는 실전 노하우를 공유합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-sns-copy',
      publishedAt: new Date('2024-11-15'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 180,
        displayMinutes: 3,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '플랫폼별 최적 길이와 톤앤매너를 고려한 카피 생성',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '해시태그 추천 및 이모지 자동 삽입',
        },
      ],
    },
    {
      id: 'content-7',
      title: 'Midjourney로 브랜드 로고 디자인하기',
      description: '전문 디자이너 없이도 Midjourney를 활용해 깔끔하고 전문적인 브랜드 로고를 제작하는 방법을 알려드립니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-logo',
      publishedAt: new Date('2024-11-12'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 420,
        displayMinutes: 7,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '프롬프트: "minimalist logo, modern tech company, vector style, simple --no text"',
        },
      ],
    },
    {
      id: 'content-8',
      title: 'Notion AI로 업무 보고서 5분 만에 완성하기',
      description: '주간/월간 업무 보고서를 Notion AI의 도움으로 신속하게 작성하고 구조화하는 방법을 소개합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/notion-report',
      publishedAt: new Date('2024-11-08'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[2].id], // Notion AI
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 300,
        displayMinutes: 5,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '주요 성과와 KPI를 자동으로 하이라이트',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '다음 주 계획 자동 생성 및 우선순위 제안',
        },
      ],
    },
    {
      id: 'content-9',
      title: 'ChatGPT로 프레젠테이션 스크립트 작성하기',
      description: '발표 자료에 딱 맞는 스크립트를 ChatGPT로 작성하고 청중의 반응을 이끌어내는 표현을 배워보세요.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-presentation',
      publishedAt: new Date('2024-11-05'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[0].id], // ChatGPT
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 360,
        displayMinutes: 6,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '슬라이드별 발표 시간 배분과 핵심 메시지 정리',
        },
      ],
    },
    {
      id: 'content-10',
      title: 'Midjourney로 인포그래픽 제작하기',
      description: '복잡한 데이터를 시각적으로 표현하는 인포그래픽을 Midjourney로 쉽게 만드는 방법을 안내합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-infographic',
      publishedAt: new Date('2024-11-01'),
      language: Language.KO,
      difficulty: Difficulty.ADVANCED,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 480,
        displayMinutes: 8,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '데이터 시각화 스타일 가이드 및 색상 팔레트 제안',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '차트, 아이콘, 다이어그램 통합 디자인',
        },
      ],
    },
    {
      id: 'content-11',
      title: 'ChatGPT로 고객 FAQ 자동 생성하기',
      description: '제품이나 서비스에 대한 자주 묻는 질문과 답변을 ChatGPT로 체계적으로 정리하는 방법입니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-faq',
      publishedAt: new Date('2024-10-28'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id, tags[2].id], // 초보자 추천, 생산성, 무료
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 240,
        displayMinutes: 4,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '업종별 FAQ 템플릿 20가지 제공',
        },
      ],
    },
    {
      id: 'content-12',
      title: 'Notion AI로 프로젝트 계획서 빠르게 작성하기',
      description: '프로젝트 목표, 일정, 리소스를 Notion AI와 함께 구조화하고 팀과 공유할 수 있는 계획서를 만듭니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/notion-project-plan',
      publishedAt: new Date('2024-10-25'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[2].id], // Notion AI
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 420,
        displayMinutes: 7,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '마일스톤 자동 생성 및 담당자 배정 가이드',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '리스크 분석 및 대응 계획 템플릿',
        },
      ],
    },
    {
      id: 'content-13',
      title: 'Midjourney로 배너 광고 디자인하기',
      description: '온라인 광고에 최적화된 눈길을 사로잡는 배너를 Midjourney로 제작하는 실전 가이드입니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-banner',
      publishedAt: new Date('2024-10-20'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 240,
        displayMinutes: 4,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '사이즈별 배너 템플릿: 728x90, 300x250, 160x600',
        },
      ],
    },
    {
      id: 'content-14',
      title: 'ChatGPT로 제품 상세 설명 작성하기',
      description: '쇼핑몰 상품 페이지에 필요한 매력적이고 설득력 있는 제품 설명을 ChatGPT로 빠르게 생성합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-product-description',
      publishedAt: new Date('2024-10-15'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 180,
        displayMinutes: 3,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '제품 특징을 강점으로 전환하는 카피라이팅 기법',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: 'SEO 키워드 자동 삽입 및 구매 전환율 향상 문구',
        },
      ],
    },
    {
      id: 'content-15',
      title: 'Notion AI로 회의 안건 자동 생성하기',
      description: '효율적인 회의를 위한 안건과 논의 포인트를 Notion AI로 미리 준비하는 방법을 소개합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/notion-agenda',
      publishedAt: new Date('2024-10-10'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[2].id], // Notion AI
      tags: [tags[0].id, tags[1].id, tags[2].id], // 초보자 추천, 생산성, 무료
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 120,
        displayMinutes: 2,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '회의 유형별 안건 템플릿 자동 생성',
        },
      ],
    },
    {
      id: 'content-16',
      title: 'ChatGPT로 영어 이메일 번역 및 작성하기',
      description: '해외 거래처와의 이메일 작성이 부담스러우신가요? ChatGPT로 전문적인 비즈니스 영어 이메일을 쉽게 작성하세요.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-email-translation',
      publishedAt: new Date('2024-10-05'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 180,
        displayMinutes: 3,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '상황별 영어 이메일 템플릿: 요청, 사과, 제안, 감사',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '격식 수준 조절 및 문화적 뉘앙스 반영',
        },
      ],
    },
    {
      id: 'content-17',
      title: 'Midjourney로 캐릭터 디자인하기',
      description: '브랜드 마스코트나 게임 캐릭터를 Midjourney로 제작하는 방법과 일관성 있는 캐릭터 시트 만들기를 배웁니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-character',
      publishedAt: new Date('2024-09-30'),
      language: Language.KO,
      difficulty: Difficulty.ADVANCED,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 540,
        displayMinutes: 9,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '캐릭터 일관성 유지를 위한 시드값 활용법',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '다양한 포즈와 표정 생성 프롬프트 예시',
        },
      ],
    },
    {
      id: 'content-18',
      title: 'ChatGPT로 마케팅 전략 수립하기',
      description: '시장 분석부터 타겟 고객 설정, 채널 전략까지 ChatGPT와 함께 체계적인 마케팅 계획을 세워보세요.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-marketing-strategy',
      publishedAt: new Date('2024-09-25'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 480,
        displayMinutes: 8,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: 'SWOT 분석 및 경쟁사 포지셔닝 맵 생성',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '채널별 콘텐츠 캘린더 및 KPI 설정',
        },
      ],
    },
    {
      id: 'content-19',
      title: 'Notion AI로 업무 체크리스트 자동 생성하기',
      description: '프로젝트나 일상 업무의 체크리스트를 Notion AI가 자동으로 만들어주고 우선순위까지 정리해줍니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/notion-checklist',
      publishedAt: new Date('2024-09-20'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[2].id], // Notion AI
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 120,
        displayMinutes: 2,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '업무 유형별 체크리스트 템플릿 즉시 생성',
        },
      ],
    },
    {
      id: 'content-20',
      title: 'Midjourney로 일러스트 제작하기',
      description: '블로그, 웹사이트, 발표 자료에 활용할 수 있는 고퀄리티 일러스트를 Midjourney로 만드는 방법입니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-illustration',
      publishedAt: new Date('2024-09-15'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 360,
        displayMinutes: 6,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '일러스트 스타일 가이드: 플랫, 3D, 수채화, 라인아트',
        },
      ],
    },
    {
      id: 'content-21',
      title: 'ChatGPT로 광고 카피 작성하기',
      description: '클릭률을 높이는 매력적인 광고 문구를 ChatGPT로 생성하고 A/B 테스트용 변형까지 만들어보세요.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-ad-copy',
      publishedAt: new Date('2024-09-10'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 300,
        displayMinutes: 5,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: 'Google Ads, 페이스북, 인스타그램 광고 형식별 최적화',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '감정을 자극하는 카피 작성 프레임워크',
        },
      ],
    },
    {
      id: 'content-22',
      title: 'Notion AI로 팀 온보딩 문서 만들기',
      description: '새로운 팀원이 빠르게 적응할 수 있도록 Notion AI로 체계적인 온보딩 가이드를 작성합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/notion-onboarding',
      publishedAt: new Date('2024-09-05'),
      language: Language.KO,
      difficulty: Difficulty.INTERMEDIATE,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[2].id], // Notion AI
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 420,
        displayMinutes: 7,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '첫 주 일정, 필수 도구, 팀 문화 가이드 자동 생성',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '역할별 맞춤 온보딩 체크리스트',
        },
      ],
    },
    {
      id: 'content-23',
      title: 'ChatGPT로 상품 리뷰 생성하기',
      description: '블로그나 쇼핑몰을 위한 상세하고 설득력 있는 상품 리뷰를 ChatGPT로 작성하는 방법입니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-product-review',
      publishedAt: new Date('2024-08-30'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[0].id], // 마케팅
      tools: [tools[0].id], // ChatGPT
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 240,
        displayMinutes: 4,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '장단점 분석 및 구매 추천 의견 자동 생성',
        },
      ],
    },
    {
      id: 'content-24',
      title: 'Midjourney로 이벤트 포스터 디자인하기',
      description: '세미나, 워크샵, 파티 등 다양한 이벤트 포스터를 Midjourney로 빠르게 제작하는 가이드입니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/midjourney-poster',
      publishedAt: new Date('2024-08-25'),
      language: Language.KO,
      difficulty: Difficulty.BEGINNER,
      categories: [categories[1].id], // 디자인
      tools: [tools[1].id], // Midjourney
      tags: [tags[0].id, tags[1].id], // 초보자 추천, 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 300,
        displayMinutes: 5,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '이벤트 분위기별 디자인 스타일 가이드',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: 'A4, A3 사이즈 최적화 및 인쇄 가이드',
        },
      ],
    },
    {
      id: 'content-25',
      title: 'ChatGPT로 교육 커리큘럼 작성하기',
      description: '강의나 교육 프로그램의 커리큘럼을 ChatGPT와 함께 체계적으로 설계하고 학습 목표를 설정합니다.',
      author: 'AI Pickly 편집팀',
      sourceUrl: 'https://example.com/chatgpt-curriculum',
      publishedAt: new Date('2024-08-20'),
      language: Language.KO,
      difficulty: Difficulty.ADVANCED,
      categories: [categories[2].id], // 문서 작성
      tools: [tools[0].id], // ChatGPT
      tags: [tags[1].id], // 생산성
      estimatedTime: {
        type: TimeType.TEXT_KO,
        value: 600,
        displayMinutes: 10,
      },
      previews: [
        {
          order: 0,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '학습 단계별 목표 설정 및 평가 기준 생성',
        },
        {
          order: 1,
          type: PreviewType.TEXT_DESCRIPTION,
          content: '주차별 학습 내용 및 실습 과제 구성',
        },
      ],
    },
  ]

  for (const contentData of contents) {
    const content = await prisma.content.create({
      data: {
        id: contentData.id,
        title: contentData.title,
        description: contentData.description,
        author: contentData.author,
        sourceUrl: contentData.sourceUrl,
        publishedAt: contentData.publishedAt,
        language: contentData.language,
        difficulty: contentData.difficulty,
        updatedAt: new Date(),
        categories: {
          create: contentData.categories.map((categoryId) => ({
            categoryId,
          })),
        },
        aiTools: {
          create: contentData.tools.map((toolId) => ({
            toolId,
          })),
        },
        tags: {
          create: contentData.tags.map((tagId) => ({
            tagId,
          })),
        },
        estimatedTime: {
          create: {
            id: `time-${contentData.id}`,
            type: contentData.estimatedTime.type,
            value: contentData.estimatedTime.value,
            displayMinutes: contentData.estimatedTime.displayMinutes,
          },
        },
        resultPreviews: {
          create: contentData.previews.map((preview, index) => ({
            id: `preview-${contentData.id}-${index}`,
            order: preview.order,
            type: preview.type,
            contentData: preview.content,
          })),
        },
      },
    })

    console.log(`✅ Created content: ${content.title}`)
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log(`📊 Created ${contents.length} content items with related data`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
