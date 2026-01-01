import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 Verifying database data...\n')

  // Count records
  const contentCount = await prisma.content.count()
  const categoryCount = await prisma.category.count()
  const toolCount = await prisma.aITool.count()
  const tagCount = await prisma.tag.count()

  console.log('📈 Record counts:')
  console.log(`  - Content: ${contentCount}`)
  console.log(`  - Categories: ${categoryCount}`)
  console.log(`  - AI Tools: ${toolCount}`)
  console.log(`  - Tags: ${tagCount}\n`)

  // Fetch all content with relations
  const contents = await prisma.content.findMany({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      aiTools: {
        include: {
          tool: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      estimatedTime: true,
      resultPreviews: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  console.log('📝 Content items:\n')
  contents.forEach((content, index) => {
    console.log(`${index + 1}. ${content.title}`)
    console.log(`   ID: ${content.id}`)
    console.log(`   Author: ${content.author}`)
    console.log(`   Difficulty: ${content.difficulty}`)
    console.log(`   Published: ${content.publishedAt.toLocaleDateString('ko-KR')}`)
    console.log(
      `   Categories: ${content.categories.map((c) => c.category.name).join(', ')}`
    )
    console.log(`   Tools: ${content.aiTools.map((t) => t.tool.name).join(', ')}`)
    console.log(`   Tags: ${content.tags.map((t) => t.tag.name).join(', ')}`)
    console.log(
      `   Estimated time: ${content.estimatedTime?.displayMinutes} minutes`
    )
    console.log(`   Previews: ${content.resultPreviews.length}`)
    console.log(`   Views: ${content.viewCount}, Scraps: ${content.scrapCount}\n`)
  })

  console.log('✅ Verification complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
