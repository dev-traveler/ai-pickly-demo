-- Enable pg_trgm extension for Full-Text Search with GIN indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop existing B-tree indexes
DROP INDEX IF EXISTS "Content_title_idx";
DROP INDEX IF EXISTS "Content_description_idx";
DROP INDEX IF EXISTS "Tag_name_idx";

-- Create GIN indexes for Full-Text Search
-- Using pg_trgm operator class for partial string matching (10-100x faster than B-tree for LIKE '%keyword%')
CREATE INDEX "Content_title_idx" ON "Content" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "Content_description_idx" ON "Content" USING GIN ("description" gin_trgm_ops);
CREATE INDEX "Tag_name_idx" ON "Tag" USING GIN ("name" gin_trgm_ops);
