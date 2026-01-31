// types.ts - Type definitions for the AI Content Collector MCP Server

export enum Difficulty {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum Language {
  KO = "KO",
  EN = "EN"
}

export enum PreviewType {
  IMAGE_URL = "IMAGE_URL",
  VIDEO_URL = "VIDEO_URL",
  TEXT_DESCRIPTION = "TEXT_DESCRIPTION"
}

export enum TimeType {
  VIDEO = "VIDEO",
  TEXT_KO = "TEXT_KO",
  TEXT_EN = "TEXT_EN"
}

export enum ResponseFormat {
  JSON = "json",
  MARKDOWN = "markdown"
}

// Content structure for Supabase
export interface ContentData {
  id: string;
  title: string;
  description: string;
  author: string;
  sourceUrl: string;
  publishedAt: string; // ISO date string
  language: Language;
  thumbnailUrl?: string;
  difficulty: Difficulty;
  viewCount: number;
  scrapCount: number;
  updatedAt: string; // ISO date string
}

export interface AIToolData {
  id: string;
  name: string;
  slug: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

export interface TagData {
  id: string;
  name: string;
  slug: string;
}

export interface EstimatedTimeData {
  id: string;
  contentId: string;
  type: TimeType;
  value: number;
  displayMinutes?: number;
}

export interface ResultPreviewData {
  id: string;
  contentId: string;
  order: number;
  type: PreviewType;
  contentData: string;
}

// AI Analysis result
export interface AIAnalysisResult {
  category: string; // One of: 바이브 코딩, AI 활용, 시각 디자인, 디지털 마케팅
  aiTools: string[]; // e.g., ["ChatGPT", "Cursor", "MidJourney"]
  description: string; // Korean, ~에요체
  tags: string[]; // e.g., ["#AI활용", "#자동화"]
  difficulty: Difficulty;
  language: Language;
  estimatedTime?: {
    type: TimeType;
    value: number;
  };
  resultPreviews?: {
    type: PreviewType;
    contentData: string;
  }[];
}

// Scraped content from web
export interface ScrapedContent {
  title: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  content: string; // Full text content
  url: string;
  wordCount?: number;
  duration?: number; // For videos in seconds
}

// YouTube specific data
export interface YouTubeVideoData {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  viewCount: number;
  url: string;
}

// Complete content package ready for DB
export interface ContentPackage {
  content: ContentData;
  categories: string[]; // Category names
  aiTools: string[]; // AI tool names
  tags: string[]; // Tag names (with #)
  estimatedTime?: EstimatedTimeData;
  resultPreviews?: ResultPreviewData[];
}
