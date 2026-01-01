import { prisma } from "@/lib/prisma";

async function testSearchPerformance() {
  console.log("🚀 Testing Search Performance with EXPLAIN ANALYZE...\n");

  const keyword = "ChatGPT";

  try {
    console.log(`Searching for: "${keyword}"\n`);

    // EXPLAIN ANALYZE로 쿼리 플랜 확인
    console.log("=== Query Execution Plan ===");
    const queryPlan = await prisma.$queryRawUnsafe<
      Array<{ "QUERY PLAN": string }>
    >(`
      EXPLAIN ANALYZE
      SELECT id, title, description
      FROM "Content"
      WHERE title ILIKE '%${keyword}%'
      LIMIT 10;
    `);

    queryPlan.forEach((row) => {
      console.log(row["QUERY PLAN"]);
    });

    console.log("\n=== Analysis ===");

    const planText = queryPlan.map((row) => row["QUERY PLAN"]).join(" ");

    // GIN index 사용 여부 확인
    const usesGinIndex =
      planText.includes("Bitmap Index Scan") &&
      planText.includes("Content_title_idx");
    const usesSeqScan = planText.includes("Seq Scan");

    if (usesGinIndex) {
      console.log(
        "✅ Query is using GIN index (Content_title_idx) - OPTIMIZED!"
      );
      console.log(
        "   This means the pg_trgm extension and GIN indexes are working correctly."
      );
    } else if (usesSeqScan) {
      console.log("⚠️  Query is using Sequential Scan - NOT OPTIMIZED!");
      console.log(
        "   This means GIN indexes might not be set up correctly or the dataset is too small."
      );
    } else {
      console.log("ℹ️  Query execution plan:");
      console.log(
        "   Review the plan above to determine which index (if any) is being used."
      );
    }

    // 실행 시간 추출
    const timingLine = queryPlan.find((row) =>
      row["QUERY PLAN"].includes("Execution Time")
    );
    if (timingLine) {
      console.log(`\n⏱️  ${timingLine["QUERY PLAN"]}`);
    }
  } catch (error) {
    console.error("❌ Error during performance test:", error);
    throw error;
  }
}

testSearchPerformance()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
