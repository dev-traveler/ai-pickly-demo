import { PrismaClient, Difficulty, Language, TimeType, PreviewType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface PropertiesJSON {
  category: string;
  ai_tool: string[];
  rn_time?: string;
  description: string;
  tag: string[];
  level: string;
  language: string;
  result_preview: string[];
}

function parseDifficulty(level: string): Difficulty {
  const normalized = level.toUpperCase().trim();
  if (normalized === "BEGINNER" || normalized === "초급") return "BEGINNER";
  if (normalized === "INTERMEDIATE" || normalized === "중급") return "INTERMEDIATE";
  if (normalized === "ADVANCED" || normalized === "고급") return "ADVANCED";
  return "BEGINNER";
}

function parseLanguage(language: string | undefined): Language {
  if (!language) return "KO"; // Default to Korean if not specified
  const normalized = language.toUpperCase().trim();
  if (normalized === "EN" || normalized === "ENGLISH" || normalized === "영어") return "EN";
  return "KO";
}

function parseTimeToSeconds(timeStr: string): number {
  // Format: HH:MM:SS or MM:SS
  const parts = timeStr.split(":").map(p => parseInt(p, 10));
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

function parseDate(dateStr: string): Date {
  // Format: "2025년 11월 4일"
  const match = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[#\s]/g, "")
    .replace(/[^\w가-힣-]/g, "");
}

function parseCSVRow(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Toggle quote status but don't add the quote itself
      // We'll keep the content inside quotes
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Double quote escape - keep one quote
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

async function main() {
  console.log("🚀 Starting content migration from CSV...\n");

  const csvPath = path.join(__dirname, "../lib/db/contents_data_final.csv");

  if (!fs.existsSync(csvPath)) {
    console.error("❌ CSV file not found:", csvPath);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");

  // Parse multiline CSV (JSON spans multiple lines)
  // Each row starts with CONTENTS-XXX pattern
  const rows: string[] = [];
  const allLines = csvContent.split("\n");
  let currentRow = "";

  for (let i = 1; i < allLines.length; i++) {
    const line = allLines[i];

    // Check if this line starts a new row (starts with CONTENTS-)
    if (line.match(/^CONTENTS-\d+/)) {
      // Save previous row if exists
      if (currentRow.trim()) {
        rows.push(currentRow);
      }
      currentRow = line;
    } else {
      // Continue current row (multiline JSON)
      currentRow += "\n" + line;
    }
  }

  // Add last row if exists
  if (currentRow.trim()) {
    rows.push(currentRow);
  }

  console.log(`📊 Found ${rows.length} rows in CSV\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    try {
      const values = parseCSVRow(rows[i]);

      if (values.length < 7) {
        console.log(`⚠️  Skipping incomplete row ${i + 1}: got ${values.length} fields`);
        continue;
      }

      const id = values[0];
      const title = values[1];
      const author = values[2];
      const dateStr = values[3];
      const sourceUrl = values[4];
      const propertiesStr = values[5];
      const thumbnailUrl = values[6] || null;

      console.log(`Processing: ${id} - ${title.substring(0, 50)}...`);

      // Debug: log first 200 chars of properties string
      if (i === 0) {
        console.log("DEBUG - Raw properties string (first 200 chars):");
        console.log(propertiesStr.substring(0, 200));
        console.log("\n");
      }

      // Parse Properties JSON - replace escaped quotes
      const cleanPropertiesStr = propertiesStr.replace(/""/g, '"');
      const properties: PropertiesJSON = JSON.parse(cleanPropertiesStr);

      // Parse date
      const publishedAt = parseDate(dateStr);

      // Create or update Content
      await prisma.content.upsert({
        where: { id },
        update: {
          title,
          description: properties.description,
          author,
          sourceUrl,
          publishedAt,
          language: parseLanguage(properties.language),
          thumbnailUrl,
          difficulty: parseDifficulty(properties.level),
          updatedAt: new Date(),
        },
        create: {
          id,
          title,
          description: properties.description,
          author,
          sourceUrl,
          publishedAt,
          language: parseLanguage(properties.language),
          thumbnailUrl,
          difficulty: parseDifficulty(properties.level),
          updatedAt: new Date(),
        },
      });

      // Create or update Category relation
      const categoryId = properties.category;
      await prisma.category.upsert({
        where: { id: categoryId },
        update: {},
        create: {
          id: categoryId,
          name: categoryId,
          slug: categoryId,
        },
      });

      await prisma.contentCategory.upsert({
        where: {
          contentId_categoryId: {
            contentId: id,
            categoryId: categoryId,
          },
        },
        update: {},
        create: {
          contentId: id,
          categoryId: categoryId,
        },
      });

      // Create or update AI Tools relations
      for (const toolSlug of properties.ai_tool) {
        await prisma.aITool.upsert({
          where: { id: toolSlug },
          update: {},
          create: {
            id: toolSlug,
            name: toolSlug,
            slug: toolSlug,
          },
        });

        await prisma.contentAITool.upsert({
          where: {
            contentId_toolId: {
              contentId: id,
              toolId: toolSlug,
            },
          },
          update: {},
          create: {
            contentId: id,
            toolId: toolSlug,
          },
        });
      }

      // Create or update Tags relations
      for (const tagName of properties.tag) {
        const cleanTagName = tagName.replace(/^#/, "");
        const tagSlug = slugify(cleanTagName);
        const tagId = `tag-${tagSlug}`;

        await prisma.tag.upsert({
          where: { id: tagId },
          update: {},
          create: {
            id: tagId,
            name: cleanTagName,
            slug: tagSlug,
          },
        });

        await prisma.contentTag.upsert({
          where: {
            contentId_tagId: {
              contentId: id,
              tagId: tagId,
            },
          },
          update: {},
          create: {
            contentId: id,
            tagId: tagId,
          },
        });
      }

      // Create or update EstimatedTime
      if (properties.rn_time) {
        const timeInSeconds = parseTimeToSeconds(properties.rn_time);
        const displayMinutes = Math.ceil(timeInSeconds / 60);

        // Determine time type based on category or source
        const timeType: TimeType = sourceUrl.includes("youtube") ? "VIDEO" : "TEXT_KO";

        await prisma.estimatedTime.upsert({
          where: { contentId: id },
          update: {
            type: timeType,
            value: timeInSeconds,
            displayMinutes: displayMinutes,
          },
          create: {
            id: `time-${id}`,
            contentId: id,
            type: timeType,
            value: timeInSeconds,
            displayMinutes: displayMinutes,
          },
        });
      }

      // Create or update ResultPreviews
      // Delete existing previews first
      await prisma.resultPreview.deleteMany({
        where: { contentId: id },
      });

      // Create new previews
      for (let j = 0; j < properties.result_preview.length; j++) {
        await prisma.resultPreview.create({
          data: {
            id: `preview-${id}-${j}`,
            contentId: id,
            order: j,
            type: "TEXT_DESCRIPTION",
            contentData: properties.result_preview[j],
          },
        });
      }

      console.log(`✅ Success: ${id}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing row ${i}:`, error);
      errors.push(`Row ${i}: ${error}`);
      errorCount++;
    }
  }

  console.log("=".repeat(60));
  console.log("📊 Migration Summary:");
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log("=".repeat(60));

  if (errors.length > 0) {
    console.log("\n❌ Error details:");
    errors.forEach((err) => console.log(`   ${err}`));
  }
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
