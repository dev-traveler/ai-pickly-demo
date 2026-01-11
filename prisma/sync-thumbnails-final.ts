import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const prisma = new PrismaClient();

// .env 파일 읽기
const envPath = fs.existsSync(".env.local")
  ? ".env.local"
  : fs.existsSync(".env")
    ? ".env"
    : null;

if (!envPath) {
  console.error("❌ No .env or .env.local file found");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};

envContent.split("\n").forEach((line) => {
  line = line.trim();
  if (line && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Try service role key first, fall back to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  console.error("URL:", supabaseUrl ? "✅" : "❌");
  console.error("Service Key:", supabaseServiceKey ? "✅" : "❌");
  console.error("Anon Key:", supabaseAnonKey ? "✅" : "❌");
  process.exit(1);
}

console.log("✅ Supabase credentials loaded:");
console.log("   URL:", supabaseUrl);
console.log("   Using:", supabaseServiceKey ? "Service Role Key" : "Anon Key");
console.log("   Key:", supabaseKey ? `${supabaseKey.substring(0, 20)}...` : "❌");

const supabase = createClient(supabaseUrl, supabaseKey);

// 파일명에서 Content ID 추출
function extractContentId(fileName: string): string | null {
  // CONTENTS-19.jpg -> CONTENTS-19
  // CONTENTS-1.webp -> CONTENTS-1
  const withoutExt = fileName.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");
  return withoutExt;
}

async function main() {
  console.log("🚀 Starting thumbnail sync from Supabase Storage...\n");

  try {
    // 1. Storage에서 파일 목록 가져오기
    console.log("🔍 Attempting to list files from contents_thumbnail bucket...");
    const { data: files, error: listError } = await supabase.storage
      .from("contents_thumbnail")
      .list();

    if (listError) {
      console.error("❌ Error listing files:", listError);
      console.error("   Error details:", JSON.stringify(listError, null, 2));
      return;
    }

    console.log("📦 Raw response - files:", files?.length || 0);

    if (!files || files.length === 0) {
      console.log("⚠️  No files found in contents_thumbnail bucket");
      return;
    }

    // 이미지 파일만 필터링
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
    );

    console.log(`📁 Found ${imageFiles.length} image files in Storage`);
    console.log(
      `📋 First 5 files: ${imageFiles.slice(0, 5).map((f) => f.name).join(", ")}\n`
    );

    // 2. DB에서 모든 Content 가져오기
    const contents = await prisma.content.findMany({
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
      },
    });

    console.log(`📊 Found ${contents.length} contents in DB`);
    console.log(
      `📋 First 5 content IDs: ${contents.slice(0, 5).map((c) => c.id).join(", ")}\n`
    );

    // 통계
    let updatedCount = 0;
    let alreadySetCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    // 3. 각 파일을 Content와 매칭하여 업데이트
    for (const file of imageFiles) {
      const contentId = extractContentId(file.name);

      if (!contentId) {
        console.log(`⚠️  Could not extract ID from: ${file.name}`);
        continue;
      }

      // DB에서 해당 Content 찾기
      const content = contents.find((c) => c.id === contentId);

      if (!content) {
        console.log(`⚠️  No content found for ID: ${contentId} (file: ${file.name})`);
        notFoundCount++;
        continue;
      }

      // Public URL 생성
      const { data: urlData } = supabase.storage
        .from("contents_thumbnail")
        .getPublicUrl(file.name);

      const newUrl = urlData.publicUrl;

      // 이미 설정되어 있으면 스킵
      if (content.thumbnailUrl === newUrl) {
        alreadySetCount++;
        continue;
      }

      try {
        // DB 업데이트
        await prisma.content.update({
          where: { id: contentId },
          data: { thumbnailUrl: newUrl },
        });

        console.log(`✅ Updated: ${content.title.substring(0, 60)}...`);
        console.log(`   ID: ${contentId}`);
        console.log(`   File: ${file.name}`);
        console.log(`   URL: ${newUrl}\n`);

        updatedCount++;
      } catch (error) {
        console.error(`❌ Error updating ${contentId}:`, error);
        errorCount++;
      }
    }

    console.log("=".repeat(60));
    console.log("📊 Sync Summary:");
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Already set: ${alreadySetCount}`);
    console.log(`   ⚠️  Skipped (not found): ${notFoundCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📁 Total files processed: ${imageFiles.length}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n💥 Error:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✨ Thumbnail sync completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Sync failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
