import { prisma } from "@/lib/prisma";

async function testGinIndexForced() {
  console.log("🧪 Testing GIN Index (Forced Usage)...\n");

  const keyword = "ChatGPT";

  try {
    console.log(`Searching for: "${keyword}"\n`);

    // Sequential Scan을 비활성화하여 GIN index를 강제로 사용
    await prisma.$executeRaw`SET enable_seqscan = OFF;`;

    console.log("=== With GIN Index (Forced) ===");
    const queryPlanForced = await prisma.$queryRawUnsafe<
      Array<{ "QUERY PLAN": string }>
    >(`
      EXPLAIN ANALYZE
      SELECT id, title, description
      FROM "Content"
      WHERE title ILIKE '%${keyword}%'
      LIMIT 10;
    `);

    queryPlanForced.forEach((row) => {
      console.log(row["QUERY PLAN"]);
    });

    // Sequential Scan 다시 활성화
    await prisma.$executeRaw`SET enable_seqscan = ON;`;

    console.log("\n=== Analysis ===");

    const planText = queryPlanForced.map((row) => row["QUERY PLAN"]).join(" ");

    const usesBitmapScan = planText.includes("Bitmap");
    const usesGinIndex = planText.includes("Content_title_idx");

    if (usesBitmapScan && usesGinIndex) {
      console.log("✅ GIN index is working correctly!");
      console.log(
        "   When dataset grows, PostgreSQL will automatically use this index."
      );
    } else {
      console.log("⚠️  GIN index might not be functioning as expected.");
      console.log("   Review the execution plan above for details.");
    }

    console.log("\n💡 Note:");
    console.log(
      "   With only 5 content items, PostgreSQL prefers Sequential Scan."
    );
    console.log(
      "   As data grows (100+ items), GIN index will be used automatically for better performance."
    );
  } catch (error) {
    console.error("❌ Error during test:", error);
    // Sequential Scan 복원
    await prisma.$executeRaw`SET enable_seqscan = ON;`;
    throw error;
  }
}

testGinIndexForced()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
