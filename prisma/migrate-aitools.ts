import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// AI Tool slug -> Display Name 매핑
const AI_TOOL_NAMES: Record<string, string> = {
  abocadoai: "Avocado AI",
  adobefirefly: "Adobe Firefly",
  arcads: "Arcads",
  artlist: "Artlist",
  canva: "Canva",
  capcut: "CapCut",
  chatgpt: "ChatGPT",
  chatsonic: "Chatsonic",
  claudecode: "Claude Code",
  cursor: "Cursor",
  dalle3: "DALL-E 3",
  deevidai: "Deevid AI",
  flamel: "Flamel",
  flow: "Flow",
  flux: "Flux",
  freepik: "Freepik",
  gamma: "Gamma",
  gemini: "Gemini",
  genspark: "Genspark",
  googleaistudio: "Google AI Studio",
  googlemixboard: "Google Mixboard",
  googlestitch: "Google Stitch",
  grok: "Grok",
  hailuoai: "Hailuo AI",
  higgsfield: "Higgsfield",
  ideogram: "Ideogram",
  imagefx: "ImageFX",
  imagen4: "Imagen 4",
  klingai: "Kling AI",
  leonardoai: "Leonardo AI",
  lovable: "Lovable",
  loavable: "Lovable", // typo in CSV
  lumaai: "Luma AI",
  magiceraser: "Magic Eraser",
  make: "Make",
  midjourney: "Midjourney",
  minmax: "MiniMax",
  napkinai: "Napkin AI",
  notebooklm: "NotebookLM",
  perplexity: "Perplexity",
  piccopilot: "Pic Copilot",
  picrumen: "Picrumen",
  ponder: "Ponder AI",
  replit: "Replit",
  runway: "Runway",
  skywork: "Skywork AI",
  sora2: "Sora 2",
  suno: "Suno",
  topviewai: "TopView AI",
  ttsmaker: "TTSMaker",
  typecast: "Typecast",
  veo3: "Veo 3",
  vrew: "Vrew",
  writesonic: "Writesonic",
  wrtn: "Wrtn",
};

// .env 파일 읽기
function loadEnv(): Record<string, string> {
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

  return envVars;
}

async function main() {
  console.log("🚀 Starting AI Tools migration from CSV...\n");

  // Load environment variables
  const envVars = loadEnv();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get logo files from Storage
  console.log("📦 Fetching logo files from ai-tool-logos bucket...");
  const { data: logoFiles, error: logoError } = await supabase.storage
    .from("ai-tool-logos")
    .list();

  if (logoError) {
    console.error("❌ Error fetching logos:", logoError);
    process.exit(1);
  }

  // Create a map of slug -> logo URL
  const logoMap: Record<string, string> = {};
  for (const file of logoFiles || []) {
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)) {
      const slug = file.name.replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, "");
      const { data: urlData } = supabase.storage
        .from("ai-tool-logos")
        .getPublicUrl(file.name);
      logoMap[slug] = urlData.publicUrl;
    }
  }

  console.log(`📁 Found ${Object.keys(logoMap).length} logo files\n`);

  // Read CSV file
  const csvPath = path.join(__dirname, "../lib/db/aitool_db.csv");

  if (!fs.existsSync(csvPath)) {
    console.error("❌ CSV file not found:", csvPath);
    console.log("Please make sure aitool_db.csv exists in lib/db/");
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim());

  // Skip header row, get slugs
  const slugs = lines.slice(1).map((line) => line.trim().replace(/^\uFEFF/, "")); // Remove BOM if present

  console.log(`📊 Found ${slugs.length} AI tools in CSV\n`);

  let successCount = 0;
  let errorCount = 0;
  let logoCount = 0;

  for (const slug of slugs) {
    if (!slug) continue;

    try {
      const displayName = AI_TOOL_NAMES[slug] || slug; // Fallback to slug if no mapping
      const logoUrl = logoMap[slug] || logoMap[slug.replace("-", "")] || null;

      // Handle special cases for logo matching
      let finalLogoUrl = logoUrl;
      if (!finalLogoUrl) {
        // Try alternate naming patterns
        if (slug === "ponder" && logoMap["ponder-ai"]) {
          finalLogoUrl = logoMap["ponder-ai"];
        }
      }

      console.log(`Processing: ${slug} -> ${displayName}`);
      if (finalLogoUrl) {
        console.log(`   Logo: ✅`);
        logoCount++;
      } else {
        console.log(`   Logo: ❌ (not found)`);
      }

      await prisma.aITool.upsert({
        where: { id: slug },
        update: {
          name: displayName,
          slug: slug,
          logoUrl: finalLogoUrl,
        },
        create: {
          id: slug,
          name: displayName,
          slug: slug,
          logoUrl: finalLogoUrl,
        },
      });

      console.log(`   ✅ Success\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${slug}:`, error);
      errorCount++;
    }
  }

  console.log("=".repeat(60));
  console.log("📊 Migration Summary:");
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   🖼️  With logos: ${logoCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log("=".repeat(60));
}

main()
  .then(() => {
    console.log("\n✨ Migration completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
