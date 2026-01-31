// schemas/index.ts - Zod validation schemas

import { z } from "zod";
import { Difficulty, Language, ResponseFormat, TimeType, PreviewType } from "../types/index.js";

// Search and scrape content schema
export const SearchAndCollectSchema = z.object({
  query: z.string()
    .min(2, "Query must be at least 2 characters")
    .max(200, "Query must not exceed 200 characters")
    .describe("Search query for finding AI tutorial content (e.g., 'ChatGPT automation tutorial')"),
  
  source: z.enum(["youtube", "google", "both"])
    .default("both")
    .describe("Where to search for content: 'youtube' for YouTube videos, 'google' for blog posts, 'both' for both sources"),
  
  limit: z.number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .describe("Maximum number of content items to collect (1-20)"),
  
  auto_save: z.boolean()
    .default(true)
    .describe("Automatically save analyzed content to Supabase database"),
  
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

export type SearchAndCollectInput = z.infer<typeof SearchAndCollectSchema>;

// Scrape URL schema
export const ScrapeUrlSchema = z.object({
  url: z.string()
    .url("Must be a valid URL")
    .describe("URL of the content to scrape (YouTube video or blog post)"),
  
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

export type ScrapeUrlInput = z.infer<typeof ScrapeUrlSchema>;

// Analyze content schema
export const AnalyzeContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .describe("Content title"),
  
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .describe("Full text content to analyze"),
  
  url: z.string()
    .url("Must be a valid URL")
    .describe("Original URL of the content"),
  
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

export type AnalyzeContentInput = z.infer<typeof AnalyzeContentSchema>;

// Save to Supabase schema
export const SaveToSupabaseSchema = z.object({
  content_data: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    sourceUrl: z.string().url(),
    publishedAt: z.string(),
    language: z.nativeEnum(Language),
    thumbnailUrl: z.string().url().optional(),
    difficulty: z.nativeEnum(Difficulty),
    viewCount: z.number().default(0),
    scrapCount: z.number().default(0)
  }).describe("Main content data"),
  
  categories: z.array(z.string())
    .min(1, "At least one category is required")
    .describe("Category names (e.g., ['바이브 코딩'])"),
  
  ai_tools: z.array(z.string())
    .describe("AI tool names used in the content (e.g., ['ChatGPT', 'Cursor'])"),
  
  tags: z.array(z.string())
    .describe("Tags for the content (e.g., ['#AI활용', '#자동화'])"),
  
  estimated_time: z.object({
    type: z.nativeEnum(TimeType),
    value: z.number().int().positive()
  }).optional()
    .describe("Estimated time to consume the content"),
  
  result_previews: z.array(z.object({
    type: z.nativeEnum(PreviewType),
    order: z.number().int().min(0),
    contentData: z.string()
  })).optional()
    .describe("Preview data for the content results"),
  
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

export type SaveToSupabaseInput = z.infer<typeof SaveToSupabaseSchema>;

// List content schema
export const ListContentSchema = z.object({
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum number of content items to return (1-100)"),
  
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of items to skip for pagination"),
  
  category: z.string()
    .optional()
    .describe("Filter by category name (e.g., '바이브 코딩')"),
  
  difficulty: z.nativeEnum(Difficulty)
    .optional()
    .describe("Filter by difficulty level"),
  
  language: z.nativeEnum(Language)
    .optional()
    .describe("Filter by language"),
  
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

export type ListContentInput = z.infer<typeof ListContentSchema>;
