-- Enable pg_trgm extension for Full-Text Search with GIN indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('KO', 'EN');

-- CreateEnum
CREATE TYPE "PreviewType" AS ENUM ('IMAGE_URL', 'VIDEO_URL', 'TEXT_DESCRIPTION');

-- CreateEnum
CREATE TYPE "TimeType" AS ENUM ('VIDEO', 'TEXT_KO', 'TEXT_EN');

-- CreateTable
CREATE TABLE "AITool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "AITool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iconUrl" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'KO',
    "thumbnailUrl" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "scrapCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAITool" (
    "contentId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "ContentAITool_pkey" PRIMARY KEY ("contentId","toolId")
);

-- CreateTable
CREATE TABLE "ContentCategory" (
    "contentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ContentCategory_pkey" PRIMARY KEY ("contentId","categoryId")
);

-- CreateTable
CREATE TABLE "ContentTag" (
    "contentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("contentId","tagId")
);

-- CreateTable
CREATE TABLE "EstimatedTime" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "type" "TimeType" NOT NULL,
    "value" INTEGER NOT NULL,
    "displayMinutes" INTEGER,

    CONSTRAINT "EstimatedTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultPreview" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" "PreviewType" NOT NULL,
    "contentData" TEXT NOT NULL,

    CONSTRAINT "ResultPreview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AITool_name_key" ON "AITool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AITool_slug_key" ON "AITool"("slug");

-- CreateIndex
CREATE INDEX "AITool_slug_idx" ON "AITool"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex (GIN index for Full-Text Search on description)
CREATE INDEX "Content_description_idx" ON "Content" USING GIN ("description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Content_difficulty_idx" ON "Content"("difficulty");

-- CreateIndex
CREATE INDEX "Content_language_idx" ON "Content"("language");

-- CreateIndex
CREATE INDEX "Content_publishedAt_idx" ON "Content"("publishedAt");

-- CreateIndex
CREATE INDEX "Content_scrapCount_idx" ON "Content"("scrapCount");

-- CreateIndex (GIN index for Full-Text Search on title)
-- Using pg_trgm operator class for partial string matching (10-100x faster than B-tree for LIKE '%keyword%')
CREATE INDEX "Content_title_idx" ON "Content" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Content_viewCount_idx" ON "Content"("viewCount");

-- CreateIndex
CREATE INDEX "ContentAITool_toolId_idx" ON "ContentAITool"("toolId");

-- CreateIndex
CREATE INDEX "ContentCategory_categoryId_idx" ON "ContentCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ContentTag_tagId_idx" ON "ContentTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatedTime_contentId_key" ON "EstimatedTime"("contentId");

-- CreateIndex
CREATE INDEX "EstimatedTime_displayMinutes_idx" ON "EstimatedTime"("displayMinutes");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "ResultPreview_contentId_order_idx" ON "ResultPreview"("contentId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex (GIN index for Full-Text Search on tag name)
CREATE INDEX "Tag_name_idx" ON "Tag" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- AddForeignKey
ALTER TABLE "ContentAITool" ADD CONSTRAINT "ContentAITool_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAITool" ADD CONSTRAINT "ContentAITool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "AITool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCategory" ADD CONSTRAINT "ContentCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCategory" ADD CONSTRAINT "ContentCategory_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimatedTime" ADD CONSTRAINT "EstimatedTime_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultPreview" ADD CONSTRAINT "ResultPreview_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

