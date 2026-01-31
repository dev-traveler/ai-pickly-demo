#!/usr/bin/env node

// index.ts - Main MCP server entry point

import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  SearchAndCollectSchema,
  ScrapeUrlSchema,
  AnalyzeContentSchema,
  SaveToSupabaseSchema,
  ListContentSchema
} from "./schemas/index.js";
import {
  searchAndCollect,
  scrapeSingleUrl,
  analyzeWithAI,
  saveContent,
  listContentFromDB
} from "./tools/collector.js";
import { initializeSupabase } from "./services/supabase.js";

// Validate environment variables
function validateEnvironment() {
  const required = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  };
  
  const optional = {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CSE_ID: process.env.GOOGLE_CSE_ID
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  
  const missingOptional = Object.entries(optional)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
  
  if (missingOptional.length > 0) {
    console.error(`Warning: Missing optional environment variables: ${missingOptional.join(", ")}`);
    console.error(`Some features may not work without these variables.`);
  }
}

// Create and configure MCP server
async function main() {
  try {
    // Validate environment
    validateEnvironment();
    
    // Initialize Supabase
    initializeSupabase(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    
    // Create MCP server
    const server = new McpServer({
      name: "ai-content-collector-mcp-server",
      version: "1.0.0"
    });
    
    // Register Tool 1: Search and Collect AI Content
    server.registerTool(
      "ai_content_search_and_collect",
      {
        title: "Search and Collect AI Content",
        description: `Automatically search for AI tutorial content from YouTube and/or Google, scrape the content, analyze it with AI, and optionally save to Supabase database.

This is the main automation tool that combines search, scraping, AI analysis, and database storage in one operation.

Args:
  - query (string): Search query for AI tutorials (e.g., "ChatGPT automation tutorial")
  - source ('youtube' | 'google' | 'both'): Where to search (default: 'both')
  - limit (number): Maximum items to collect, 1-20 (default: 5)
  - auto_save (boolean): Auto-save to database (default: true)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  List of collected content with:
  - Title, URL, category, difficulty, AI tools, tags
  - Save status and content ID if auto_save is true
  - Any errors encountered during processing

Examples:
  - "Find 5 ChatGPT tutorials from YouTube" -> query="ChatGPT tutorial", source="youtube", limit=5
  - "Search for AI automation blog posts" -> query="AI automation", source="google"
  - "Find AI content but don't save yet" -> auto_save=false`,
        inputSchema: SearchAndCollectSchema,
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: true
        }
      },
      searchAndCollect
    );
    
    // Register Tool 2: Scrape URL
    server.registerTool(
      "ai_content_scrape_url",
      {
        title: "Scrape Content from URL",
        description: `Scrape content from a specific YouTube video or blog URL.

Extracts metadata like title, author, published date, thumbnail, and full content text. Automatically detects YouTube videos vs regular web pages.

Args:
  - url (string): YouTube video URL or blog post URL to scrape
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  Scraped content including:
  - Title, description, author, published date
  - Thumbnail URL, content text
  - Duration (for videos) or word count (for articles)

Examples:
  - Scrape YouTube video -> url="https://youtube.com/watch?v=..."
  - Scrape blog post -> url="https://medium.com/..."`,
        inputSchema: ScrapeUrlSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: true
        }
      },
      scrapeSingleUrl
    );
    
    // Register Tool 3: Analyze Content
    server.registerTool(
      "ai_content_analyze",
      {
        title: "Analyze Content with AI",
        description: `Analyze content using AI (Gemini) to extract structured metadata.

Automatically categorizes content, identifies AI tools used, generates Korean description, assigns tags, determines difficulty and language, calculates estimated time, and extracts result previews.

Args:
  - title (string): Content title
  - content (string): Full text content to analyze
  - url (string): Original URL of the content
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  AI analysis including:
  - Category (바이브 코딩, AI 활용, 시각 디자인, 디지털 마케팅)
  - AI tools mentioned/used
  - Korean description in ~에요체
  - Tags (with # prefix)
  - Difficulty (BEGINNER, INTERMEDIATE, ADVANCED)
  - Language (KO, EN)
  - Estimated time to consume content
  - Result previews if applicable`,
        inputSchema: AnalyzeContentSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: true
        }
      },
      analyzeWithAI
    );
    
    // Register Tool 4: Save to Supabase
    server.registerTool(
      "ai_content_save_to_supabase",
      {
        title: "Save Content to Supabase",
        description: `Save analyzed content to Supabase database with all relationships.

Checks for duplicates, generates IDs, and saves to multiple tables (Content, Category, AITool, Tag, EstimatedTime, ResultPreview) with proper relationships.

Args:
  - content_data (object): Main content data (title, description, author, sourceUrl, etc.)
  - categories (string[]): Category names
  - ai_tools (string[]): AI tool names
  - tags (string[]): Tags with # prefix
  - estimated_time (object, optional): Time data with type and value
  - result_previews (array, optional): Preview data
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  Success status and generated content ID

Errors:
  - Returns error if content already exists (duplicate sourceUrl)`,
        inputSchema: SaveToSupabaseSchema,
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: true
        }
      },
      saveContent
    );
    
    // Register Tool 5: List Content
    server.registerTool(
      "ai_content_list",
      {
        title: "List Content from Database",
        description: `List and filter content from Supabase database.

Supports pagination and filtering by category, difficulty, and language.

Args:
  - limit (number): Items per page, 1-100 (default: 20)
  - offset (number): Pagination offset (default: 0)
  - category (string, optional): Filter by category name
  - difficulty ('BEGINNER' | 'INTERMEDIATE' | 'ADVANCED', optional): Filter by difficulty
  - language ('KO' | 'EN', optional): Filter by language
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  Paginated list with:
  - Total count, current offset, has_more flag
  - Content items with all metadata and relationships

Examples:
  - List first 10 items -> limit=10, offset=0
  - List AI 활용 content -> category="AI 활용"
  - List beginner Korean content -> difficulty="BEGINNER", language="KO"`,
        inputSchema: ListContentSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: true
        }
      },
      listContentFromDB
    );
    
    // Start server with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error("AI Content Collector MCP Server running on stdio");
    
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

main();
