-- Add statusChangedAt column to track when isActive was last modified
-- AlterTable
ALTER TABLE "NewsletterSubscriber"
ADD COLUMN "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill existing records: set statusChangedAt to subscribedAt
-- This represents the time when the subscription status was initially set to true
UPDATE "NewsletterSubscriber"
SET "statusChangedAt" = "subscribedAt";

-- Remove the default for future operations (Prisma will handle defaults at app level)
ALTER TABLE "NewsletterSubscriber"
ALTER COLUMN "statusChangedAt" DROP DEFAULT;
