#!/usr/bin/env node

// crawler.ts - Standalone automatic content crawler

import "dotenv/config";
import { initializeSupabase, checkDuplicateContent, saveContentToSupabase } from "./services/supabase.js";
import { searchContent } from "./services/search.js";
import { scrapeUrl } from "./services/scraper.js";
import { analyzeContent } from "./services/analyzer.js";
import { ContentPackage } from "./types/index.js";
import { OFFICIAL_CATEGORIES } from "./constants.js";

// Configuration
const ITEMS_PER_CATEGORY = parseInt(process.env.ITEMS_PER_CATEGORY || "5", 10);
const CRAWL_INTERVAL_HOURS = parseInt(process.env.CRAWL_INTERVAL_HOURS || "24", 10);
const RUN_ONCE = process.env.RUN_ONCE === "true";

interface CrawlStats {
  totalSearched: number;
  totalScraped: number;
  totalAnalyzed: number;
  totalSaved: number;
  duplicatesSkipped: number;
  errors: number;
}

// Validate environment variables
function validateEnvironment() {
  const required = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

// Generate search query for category (Korean-focused) - PRD Version 2.0
function generateSearchQuery(categoryName: string): string {
  const queries: Record<string, string> = {
    // Official 4 categories as per PRD
    "text": "인공지능 글쓰기 텍스트 생성 문서 작성 ChatGPT Claude",
    "image": "인공지능 이미지 생성 그림 만들기 디자인 Midjourney DALL-E",
    "video": "인공지능 영상 생성 동영상 만들기 편집 Runway",
    "code": "인공지능 코딩 프로그래밍 개발 Cursor GitHub Copilot"
  };

  return queries[categoryName] || `${categoryName} 인공지능 활용`;
}

// Check if content is in Korean
function isKoreanContent(text: string): boolean {
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  // Consider it Korean if at least 30% of characters are Korean
  return totalChars > 0 && (koreanChars / totalChars) > 0.3;
}

// Crawl content for a single category
async function crawlCategory(
  categoryName: string,
  limit: number,
  stats: CrawlStats
): Promise<void> {
  const categoryNames: Record<string, string> = {
    'text': '텍스트 생성',
    'image': '이미지 생성',
    'video': '영상 생성',
    'code': '코딩/개발'
  };

  const categoryDisplayName = categoryNames[categoryName] || categoryName;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`📂 카테고리: ${categoryDisplayName}`);
  console.log(`🎯 목표: ${limit}개 콘텐츠 수집`);
  console.log(`${'='.repeat(50)}\n`);

  try {
    // Generate search query
    const query = generateSearchQuery(categoryName);
    console.log(`🔍 검색어: "${query}"`);

    // Search for content (YouTube only, as Google Custom Search is not enabled)
    const searchResults = await searchContent(query, "youtube", limit * 2); // Get more to account for duplicates
    stats.totalSearched += searchResults.length;

    console.log(`✓ ${searchResults.length}개의 검색 결과를 찾았습니다\n`);

    let saved = 0;

    // Process each search result
    for (const result of searchResults) {
      if (saved >= limit) {
        console.log(`\n✅ 목표 달성! ${categoryDisplayName} 카테고리에서 ${limit}개 수집 완료\n`);
        break;
      }

      try {
        const title = result.title.length > 60 ? result.title.substring(0, 60) + '...' : result.title;
        console.log(`\n  📄 [${saved + 1}/${limit}] ${title}`);

        // Filter out non-Korean content
        if (!isKoreanContent(result.title)) {
          console.log(`     🌍 건너뛰기: 한국어 콘텐츠가 아닙니다`);
          continue;
        }

        // Check for duplicates
        const isDuplicate = await checkDuplicateContent(result.url);

        if (isDuplicate) {
          console.log(`     ⏭️  건너뛰기: 이미 수집된 콘텐츠입니다`);
          stats.duplicatesSkipped++;
          continue;
        }

        // Scrape content
        console.log(`     📥 1/4 콘텐츠 크롤링 중...`);
        const scrapedContent = await scrapeUrl(result.url);
        stats.totalScraped++;
        
        // Analyze with AI (with retry on rate limit)
        console.log(`     🤖 2/4 AI 분석 중...`);
        let analysis;
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            analysis = await analyzeContent(
              scrapedContent.title,
              scrapedContent.content,
              scrapedContent.url,
              scrapedContent.duration,
              scrapedContent.wordCount
            );
            stats.totalAnalyzed++;
            break;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('rate limit') || errorMessage.includes('Resource exhausted') || errorMessage.includes('429')) {
              retries++;
              if (retries < maxRetries) {
                // Exponential backoff: 3 min, 6 min, 9 min
                const waitTime = 180000 * retries;
                const waitMinutes = Math.floor(waitTime / 60000);
                console.log(`     ⏰ API 제한 도달. ${waitMinutes}분 대기 후 재시도 (${retries}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
              } else {
                throw new Error(`${maxRetries}회 재시도 실패: ${errorMessage}`);
              }
            } else {
              throw error;
            }
          }
        }

        if (!analysis) {
          throw new Error('AI 분석 결과를 가져올 수 없습니다');
        }

        console.log(`     ✓ 분석 완료 (난이도: ${analysis.difficulty})`);

        // Prepare content package
        const contentPackage: ContentPackage = {
          content: {
            id: "", // Will be generated
            title: scrapedContent.title,
            description: analysis.description,
            author: scrapedContent.author || "Unknown",
            sourceUrl: scrapedContent.url,
            publishedAt: scrapedContent.publishedAt || new Date().toISOString(),
            language: analysis.language,
            thumbnailUrl: scrapedContent.thumbnailUrl,
            difficulty: analysis.difficulty,
            viewCount: 0,
            scrapCount: 0,
            updatedAt: new Date().toISOString()
          },
          categories: [categoryName], // Use the current category
          aiTools: analysis.aiTools,
          tags: analysis.tags,
          estimatedTime: analysis.estimatedTime ? {
            id: "",
            contentId: "",
            type: analysis.estimatedTime.type,
            value: analysis.estimatedTime.value,
            displayMinutes: analysis.estimatedTime.value
          } : undefined,
          resultPreviews: analysis.resultPreviews?.map((preview, index) => ({
            id: "",
            contentId: "",
            order: index,
            type: preview.type,
            contentData: preview.contentData
          }))
        };

        // Save to Supabase
        console.log(`     💾 3/4 데이터베이스 저장 중...`);
        await saveContentToSupabase(contentPackage);
        stats.totalSaved++;
        saved++;

        const toolsDisplay = analysis.aiTools.length > 0 ? analysis.aiTools.join(', ') : '없음';
        console.log(`     ✅ 4/4 저장 완료!`);
        console.log(`     📊 AI 도구: ${toolsDisplay}`);

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`     ❌ 오류 발생: ${errorMsg}`);
        stats.errors++;
      }

      // 60 seconds delay between content to avoid Gemini API rate limits
      if (saved < limit) {
        console.log('\n     ⏰ API 안전을 위해 60초 대기 중...\n');
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }

    console.log(`\n✅ ${categoryDisplayName} 카테고리 완료: ${saved}/${limit}개 저장\n`);

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ ${categoryDisplayName} 카테고리 수집 실패: ${errorMsg}\n`);
    stats.errors++;
  }
}

// Main crawl function
async function runCrawler(): Promise<void> {
  const now = new Date();
  const timeStr = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  console.log("\n🚀 AI 콘텐츠 수집을 시작합니다");
  console.log(`⏰ 시작 시간: ${timeStr}`);
  console.log(`📊 카테고리당 수집 개수: ${ITEMS_PER_CATEGORY}개\n`);

  const stats: CrawlStats = {
    totalSearched: 0,
    totalScraped: 0,
    totalAnalyzed: 0,
    totalSaved: 0,
    duplicatesSkipped: 0,
    errors: 0
  };

  try {
    // Validate environment
    validateEnvironment();

    // Initialize Supabase
    initializeSupabase(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    console.log("✅ 데이터베이스 연결 완료\n");

    // Use official 4 categories as per PRD
    const categories = OFFICIAL_CATEGORIES;
    const categoryNames: Record<string, string> = {
      'text': '텍스트 생성',
      'image': '이미지 생성',
      'video': '영상 생성',
      'code': '코딩/개발'
    };

    console.log(`📋 총 ${categories.length}개 카테고리에서 콘텐츠를 수집합니다:`);
    categories.forEach(cat => console.log(`  • ${categoryNames[cat] || cat}`));

    // Crawl each category
    for (const category of categories) {
      await crawlCategory(category, ITEMS_PER_CATEGORY, stats);

      // 30 seconds delay between categories as per PRD
      console.log('\n⏰ 다음 카테고리까지 30초 대기 중...\n');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }

    // Print final stats
    const endTime = new Date();
    const endTimeStr = endTime.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    console.log("\n\n📊 ════════════════════════════════════════");
    console.log("              수집 결과 요약");
    console.log("════════════════════════════════════════");
    console.log(`🔍 검색된 콘텐츠:      ${stats.totalSearched}개`);
    console.log(`📥 크롤링 완료:        ${stats.totalScraped}개`);
    console.log(`🤖 AI 분석 완료:       ${stats.totalAnalyzed}개`);
    console.log(`💾 저장 완료:          ${stats.totalSaved}개`);
    console.log(`⏭️  중복 건너뛰기:     ${stats.duplicatesSkipped}개`);
    console.log(`❌ 오류 발생:          ${stats.errors}개`);
    console.log("════════════════════════════════════════\n");

    console.log(`✅ 수집이 성공적으로 완료되었습니다 (${endTimeStr})\n`);

  } catch (error) {
    console.error("\n❌ 수집 중 오류 발생:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Schedule next run
function scheduleNextRun() {
  const intervalMs = CRAWL_INTERVAL_HOURS * 60 * 60 * 1000;
  console.log(`\n⏰ 다음 수집 예정: ${CRAWL_INTERVAL_HOURS}시간 후\n`);

  setTimeout(async () => {
    await runCrawler();
    if (!RUN_ONCE) {
      scheduleNextRun();
    }
  }, intervalMs);
}

// Main entry point
async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║      AI 콘텐츠 자동 수집 시스템         ║");
  console.log("╚════════════════════════════════════════╝\n");

  try {
    // Run first crawl
    await runCrawler();

    // Schedule next runs (unless RUN_ONCE is set)
    if (RUN_ONCE) {
      console.log("✅ 1회 수집이 완료되어 종료합니다.\n");
      process.exit(0);
    } else {
      scheduleNextRun();
    }

  } catch (error) {
    console.error("\n💥 치명적 오류:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n⏸️  사용자가 수집을 중지했습니다");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n⏸️  수집 프로세스가 종료되었습니다");
  process.exit(0);
});

// Start crawler
main();
