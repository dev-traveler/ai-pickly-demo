# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MCP (Model Context Protocol) server for automatically collecting AI tutorial content from YouTube and blogs, with Supabase storage. Two execution modes:
- **MCP Server Mode**: Claude Desktop integration for conversational content collection
- **Auto Crawler Mode**: Background service for periodic automated collection

## Build and Development Commands

```bash
# Install dependencies
npm install

# Build (TypeScript compile + make executables)
npm run build

# Development mode (MCP server with tsx)
npm run dev

# Development mode (crawler with tsx)
npm run dev:crawler

# Run crawler once (for testing)
npm run crawler:once

# Run crawler continuously (24h interval)
npm run crawler

# Type check without emitting
npx tsc --noEmit
```

## Required Environment Variables

```
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key

# Optional (for search functionality)
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-google-custom-search-engine-id

# Crawler configuration
ITEMS_PER_CATEGORY=5
CRAWL_INTERVAL_HOURS=24
RUN_ONCE=true|false
```

## Architecture

### Entry Points
- [src/index.ts](src/index.ts) - MCP server entry point, registers 5 tools with McpServer
- [src/crawler.ts](src/crawler.ts) - Standalone crawler for automated background collection

### Service Layer ([src/services/](src/services/))
- **supabase.ts** - Database operations, Storage uploads (thumbnails, AI tool logos), content CRUD
- **search.ts** - YouTube Data API v3 and Google Custom Search API integration
- **scraper.ts** - Content extraction via Jina.ai Reader and YouTube oEmbed
- **analyzer.ts** - Gemini AI analysis for categorization, tagging, difficulty assessment

### Tool Layer ([src/tools/collector.ts](src/tools/collector.ts))
Implements 5 MCP tools:
1. `ai_content_search_and_collect` - Full pipeline: search → scrape → analyze → save
2. `ai_content_scrape_url` - Single URL content extraction
3. `ai_content_analyze` - AI analysis with Gemini
4. `ai_content_save_to_supabase` - Database persistence
5. `ai_content_list` - Query content with filters

### Supporting Modules
- [src/types/index.ts](src/types/index.ts) - TypeScript enums and interfaces
- [src/schemas/index.ts](src/schemas/index.ts) - Zod validation schemas for tool inputs
- [src/constants.ts](src/constants.ts) - API URLs, AI tool logos, reading speed constants

## Database Schema (Supabase)

Main tables:
- `Content` - Core content records with `CONTENTS-XXXXX` IDs
- `Category`, `AITool`, `Tag` - Reference tables
- `ContentCategory`, `ContentAITool`, `ContentTag` - Junction tables
- `EstimatedTime`, `ResultPreview` - Content metadata

Storage buckets:
- `contents_thumbnail` - Uploaded content thumbnails
- `ai-tool-logos` - AI tool logo images

## Key Patterns

### Content ID Generation
```typescript
// Format: CONTENTS-XXXXX (5-digit padded number)
const contentId = `CONTENTS-${randomNum.toString().padStart(5, '0')}`;
```

### Duplicate Detection
Content deduplication is based on `sourceUrl` field in Content table.

### AI Analysis Response
Gemini returns JSON with: category, aiTools[], description (Korean ~에요체), tags[], difficulty, language, resultPreviews[].

### Response Formats
All tools support both `markdown` and `json` response formats via `response_format` parameter.

## External APIs

- **Jina.ai Reader**: `https://r.jina.ai/{url}` for web scraping
- **YouTube oEmbed**: `https://www.youtube.com/oembed` for video metadata
- **Gemini**: `gemini-1.5-flash` model for content analysis
- **YouTube Data API v3**: Video search
- **Google Custom Search API**: Blog/article search
