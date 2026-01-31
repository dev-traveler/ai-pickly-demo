#!/usr/bin/env tsx

// collect-url.ts - Simple CLI script to collect content from a single URL
// Usage: tsx collect-url.ts <URL>

import "dotenv/config";
import { initializeSupabase, checkDuplicateContent, saveContentToSupabase } from "./src/services/supabase.js";
import { scrapeUrl } from "./src/services/scraper.js";
import { analyzeContent } from "./src/services/analyzer.js";
import { ContentPackage } from "./src/types/index.js";

async function collectUrl(url: string) {
  console.log(`\n🔍 Collecting content from: ${url}\n`);

  try {
    // Initialize Supabase
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in .env file");
    }
    initializeSupabase(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log("✅ Supabase initialized");

    // Check for duplicates
    console.log("🔎 Checking for duplicates...");
    const isDuplicate = await checkDuplicateContent(url);
    if (isDuplicate) {
      console.log("⚠️  This content already exists in the database!");
      return;
    }

    // Scrape content
    console.log("📥 Scraping content...");
    const scrapedContent = await scrapeUrl(url);
    console.log(`   Title: ${scrapedContent.title}`);
    console.log(`   Author: ${scrapedContent.author || "Unknown"}`);

    // Analyze with Gemini
    console.log("\n🤖 Analyzing with Gemini AI...");
    const analysis = await analyzeContent(
      scrapedContent.title,
      scrapedContent.content,
      scrapedContent.url,
      scrapedContent.duration,
      scrapedContent.wordCount
    );

    console.log(`   Category: ${analysis.category}`);
    console.log(`   AI Tools: ${analysis.aiTools.join(", ") || "None"}`);
    console.log(`   Difficulty: ${analysis.difficulty}`);
    console.log(`   Tags: ${analysis.tags.join(", ")}`);

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
      categories: [analysis.category],
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

    // Save to database
    console.log("\n💾 Saving to database...");
    const result = await saveContentToSupabase(contentPackage);

    console.log("\n✅ Success!");
    console.log(`   Content ID: ${result.contentId}`);
    console.log(`   Description: ${analysis.description.substring(0, 100)}...`);

  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Main
const url = process.argv[2];

if (!url) {
  console.error("Usage: tsx collect-url.ts <URL>");
  console.error("Example: tsx collect-url.ts https://youtube.com/watch?v=abc123");
  process.exit(1);
}

collectUrl(url)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
