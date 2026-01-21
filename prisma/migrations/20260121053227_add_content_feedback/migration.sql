-- DropIndex
DROP INDEX "Content_author_idx";

-- DropIndex
DROP INDEX "Content_description_idx";

-- DropIndex
DROP INDEX "Content_title_idx";

-- DropIndex
DROP INDEX "Tag_name_idx";

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ALTER COLUMN "statusChangedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ContentFeedback" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentFeedback_email_idx" ON "ContentFeedback"("email");

-- CreateIndex
CREATE INDEX "ContentFeedback_createdAt_idx" ON "ContentFeedback"("createdAt");

-- CreateIndex
CREATE INDEX "Content_description_idx" ON "Content"("description");

-- CreateIndex
CREATE INDEX "Content_title_idx" ON "Content"("title");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
