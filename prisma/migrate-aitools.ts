import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface AIToolRow {
  id: string;
  name: string;
  slug: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
}

function parseCSV(content: string): AIToolRow[] {
  const lines = content.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.replace(/^"|"$/g, "") || "";
    });

    return row as AIToolRow;
  });
}

async function main() {
  console.log("🚀 Starting AI Tools migration from CSV...\n");

  const csvPath = path.join(__dirname, "../lib/db/aitool_db.csv");

  if (!fs.existsSync(csvPath)) {
    console.error("❌ CSV file not found:", csvPath);
    console.log("Please make sure aitool_db.csv exists in lib/db/");
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csvContent);

  console.log(`📊 Found ${rows.length} AI tools in CSV\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    try {
      console.log(`Processing: ${row.id} - ${row.name}`);

      await prisma.aITool.upsert({
        where: { id: row.id },
        update: {
          name: row.name,
          slug: row.slug,
          websiteUrl: row.websiteUrl || null,
          logoUrl: row.logoUrl || null,
          description: row.description || null,
        },
        create: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          websiteUrl: row.websiteUrl || null,
          logoUrl: row.logoUrl || null,
          description: row.description || null,
        },
      });

      console.log(`✅ Success: ${row.id}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${row.id}:`, error);
      errorCount++;
    }
  }

  console.log("=".repeat(60));
  console.log("📊 Migration Summary:");
  console.log(`   ✅ Success: ${successCount}`);
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
