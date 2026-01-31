-- Supabase Database Setup for AI Content Collector
-- Run this in Supabase SQL Editor

-- Create Enums
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "Language" AS ENUM ('KO', 'EN');
CREATE TYPE "PreviewType" AS ENUM ('IMAGE_URL', 'VIDEO_URL', 'TEXT_DESCRIPTION');
CREATE TYPE "TimeType" AS ENUM ('VIDEO', 'TEXT_KO', 'TEXT_EN');

-- Create Tables

-- Category Table
CREATE TABLE "Category" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "iconUrl" TEXT
);

CREATE INDEX idx_category_slug ON "Category"(slug);

-- AITool Table
CREATE TABLE "AITool" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "websiteUrl" TEXT,
  "logoUrl" TEXT,
  description TEXT
);

CREATE INDEX idx_aitool_slug ON "AITool"(slug);

-- Tag Table
CREATE TABLE "Tag" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE INDEX idx_tag_name ON "Tag"(name);
CREATE INDEX idx_tag_slug ON "Tag"(slug);

-- Content Table
CREATE TABLE "Content" (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  language "Language" DEFAULT 'KO',
  "thumbnailUrl" TEXT,
  difficulty "Difficulty" NOT NULL,
  "viewCount" INTEGER DEFAULT 0,
  "scrapCount" INTEGER DEFAULT 0
);

CREATE INDEX idx_content_title ON "Content"(title);
CREATE INDEX idx_content_description ON "Content"(description);
CREATE INDEX idx_content_difficulty ON "Content"(difficulty);
CREATE INDEX idx_content_language ON "Content"(language);
CREATE INDEX idx_content_published ON "Content"("publishedAt");
CREATE INDEX idx_content_viewcount ON "Content"("viewCount");
CREATE INDEX idx_content_scrapcount ON "Content"("scrapCount");

-- Junction Tables

CREATE TABLE "ContentCategory" (
  "contentId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  PRIMARY KEY ("contentId", "categoryId"),
  FOREIGN KEY ("contentId") REFERENCES "Content"(id) ON DELETE CASCADE,
  FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE CASCADE
);

CREATE INDEX idx_contentcategory_category ON "ContentCategory"("categoryId");

CREATE TABLE "ContentAITool" (
  "contentId" TEXT NOT NULL,
  "toolId" TEXT NOT NULL,
  PRIMARY KEY ("contentId", "toolId"),
  FOREIGN KEY ("contentId") REFERENCES "Content"(id) ON DELETE CASCADE,
  FOREIGN KEY ("toolId") REFERENCES "AITool"(id) ON DELETE CASCADE
);

CREATE INDEX idx_contentaitool_tool ON "ContentAITool"("toolId");

CREATE TABLE "ContentTag" (
  "contentId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  PRIMARY KEY ("contentId", "tagId"),
  FOREIGN KEY ("contentId") REFERENCES "Content"(id) ON DELETE CASCADE,
  FOREIGN KEY ("tagId") REFERENCES "Tag"(id) ON DELETE CASCADE
);

CREATE INDEX idx_contenttag_tag ON "ContentTag"("tagId");

-- EstimatedTime Table
CREATE TABLE "EstimatedTime" (
  id TEXT PRIMARY KEY,
  "contentId" TEXT UNIQUE NOT NULL,
  type "TimeType" NOT NULL,
  value INTEGER NOT NULL,
  "displayMinutes" INTEGER,
  FOREIGN KEY ("contentId") REFERENCES "Content"(id) ON DELETE CASCADE
);

CREATE INDEX idx_estimatedtime_displayminutes ON "EstimatedTime"("displayMinutes");

-- ResultPreview Table
CREATE TABLE "ResultPreview" (
  id TEXT PRIMARY KEY,
  "contentId" TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  type "PreviewType" NOT NULL,
  "contentData" TEXT NOT NULL,
  FOREIGN KEY ("contentId") REFERENCES "Content"(id) ON DELETE CASCADE
);

CREATE INDEX idx_resultpreview_content_order ON "ResultPreview"("contentId", "order");

-- NewsletterSubscriber Table
CREATE TABLE "NewsletterSubscriber" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "subscribedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "isActive" BOOLEAN DEFAULT true,
  "statusChangedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Initial Categories (based on your images)
INSERT INTO "Category" (id, name, slug) VALUES
  ('cat-coding', '바이브 코딩', 'vibe-coding'),
  ('cat-image', '이미지 생성', 'image-generation'),
  ('cat-text', '텍스트 생성', 'text-generation'),
  ('cat-video', '영상 생성', 'video-generation');

-- Enable Row Level Security (RLS) - Allow anon access for development
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AITool" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentAITool" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EstimatedTime" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ResultPreview" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anon access (for development)
-- WARNING: In production, you should restrict these policies

CREATE POLICY "Allow anon select" ON "Category" FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON "Category" FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON "Category" FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon delete" ON "Category" FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon select" ON "AITool" FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON "AITool" FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON "AITool" FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon delete" ON "AITool" FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon select" ON "Tag" FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON "Tag" FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON "Tag" FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon delete" ON "Tag" FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon select" ON "Content" FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON "Content" FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON "Content" FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon delete" ON "Content" FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anon all" ON "ContentCategory" FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all" ON "ContentAITool" FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all" ON "ContentTag" FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all" ON "EstimatedTime" FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all" ON "ResultPreview" FOR ALL TO anon USING (true);
CREATE POLICY "Allow anon all" ON "NewsletterSubscriber" FOR ALL TO anon USING (true);

-- Create Storage Buckets (run these separately in Supabase Storage UI or via API)
-- You'll need to create these manually in Supabase Dashboard → Storage:
-- 1. Bucket name: contents_thumbnail (PUBLIC)
-- 2. Bucket name: ai-tool-logos (PUBLIC)
