import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("🚀 Checking Supabase Storage...\n");
  console.log("Supabase URL:", supabaseUrl);
  console.log();

  // List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    console.error("❌ Error listing buckets:", bucketsError);
    return;
  }

  console.log(`📦 Found ${buckets?.length || 0} buckets:\n`);
  buckets?.forEach((bucket) => {
    console.log(`  - ${bucket.name} (${bucket.public ? "public" : "private"})`);
  });

  console.log();

  // List files in contents_thumbnail bucket
  console.log("📁 Files in contents_thumbnail bucket:\n");
  const { data: files, error: filesError } = await supabase.storage
    .from("contents_thumbnail")
    .list();

  if (filesError) {
    console.error("❌ Error listing files:", filesError);
    return;
  }

  if (!files || files.length === 0) {
    console.log("⚠️  No files found");
    return;
  }

  console.log(`Found ${files.length} items:\n`);

  // Show first 20 files
  files.slice(0, 20).forEach((file) => {
    const size = file.metadata?.size
      ? `${(file.metadata.size / 1024).toFixed(2)} KB`
      : "unknown size";
    console.log(`  ${file.name} (${size})`);
  });

  if (files.length > 20) {
    console.log(`\n  ... and ${files.length - 20} more files`);
  }

  // Show public URL example
  console.log("\n🔗 Example public URL:");
  if (files.length > 0) {
    const { data: urlData } = supabase.storage
      .from("contents_thumbnail")
      .getPublicUrl(files[0].name);
    console.log(urlData.publicUrl);
  }
}

main()
  .then(() => {
    console.log("\n✨ Check completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Check failed:", error);
    process.exit(1);
  });
