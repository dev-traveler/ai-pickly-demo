-- CreateIndex (GIN index for Full-Text Search on author)
-- Using pg_trgm operator class for partial string matching (10-100x faster than B-tree for LIKE '%keyword%')
CREATE INDEX "Content_author_idx" ON "Content" USING GIN ("author" gin_trgm_ops);
