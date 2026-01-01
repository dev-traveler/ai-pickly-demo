-- DropIndex
DROP INDEX "Content_description_idx";

-- DropIndex
DROP INDEX "Content_title_idx";

-- DropIndex
DROP INDEX "Tag_name_idx";

-- CreateIndex
CREATE INDEX "Content_title_idx" ON "Content"("title");

-- CreateIndex
CREATE INDEX "Content_description_idx" ON "Content"("description");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
