-- Drop existing Tag table and related data
DROP TABLE IF EXISTS "ContentTag" CASCADE;
DROP TABLE IF EXISTS "Tag" CASCADE;

-- Recreate Tag table with correct constraints
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- Create indexes for performance
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- Recreate ContentTag junction table
CREATE TABLE "ContentTag" (
    "contentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    
    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("contentId", "tagId")
);

-- Create foreign keys
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey" 
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_tagId_fkey" 
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index for ContentTag
CREATE INDEX "ContentTag_tagId_idx" ON "ContentTag"("tagId");
