#!/usr/bin/env tsx

// Script to rebuild Tag and ContentTag tables in Supabase
// This script uses direct SQL execution via Supabase management

import "dotenv/config";
import axios from "axios";

async function rebuildTables() {
  console.log("🔄 Starting Tag table rebuild...\n");
  console.log("⚠️  WARNING: This will delete all existing Tag and ContentTag data!\n");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL and SUPABASE_KEY are required");
  }

  // Extract project reference from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!projectRef) {
    throw new Error("Could not extract project reference from SUPABASE_URL");
  }

  console.log(`📊 Project Reference: ${projectRef}\n`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("MANUAL STEPS REQUIRED:");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log("Please execute the following SQL in your Supabase SQL Editor:");
  console.log(`URL: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
  console.log("───────────────────────────────────────────────────────\n");

  const sql = `-- Step 1: Drop existing tables
DROP TABLE IF EXISTS "ContentTag" CASCADE;
DROP TABLE IF EXISTS "Tag" CASCADE;

-- Step 2: Create Tag table
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create unique indexes on Tag
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- Step 4: Create ContentTag junction table
CREATE TABLE "ContentTag" (
    "contentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("contentId", "tagId")
);

-- Step 5: Add foreign keys
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE;
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_tagId_fkey"
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE;

-- Step 6: Create index on ContentTag
CREATE INDEX "ContentTag_tagId_idx" ON "ContentTag"("tagId");`;

  console.log(sql);
  console.log("\n───────────────────────────────────────────────────────");
  console.log("\n✅ After running the SQL above, your Tag tables will be rebuilt.");
  console.log("✅ The retry logic in upsertTag() will handle race conditions.");
  console.log("\n📝 SQL script has also been saved to: fix_tag_table.sql");
}

rebuildTables()
  .then(() => {
    console.log("\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
