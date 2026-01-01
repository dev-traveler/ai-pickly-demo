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
            content: preview.content,
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
