import { prisma } from "@/lib/prisma";

async function verifyFTS() {
  console.log("🔍 Verifying Full-Text Search Optimization...\n");

  try {
    // 1. pg_trgm extension 확인
    console.log("=== 1. pg_trgm Extension ===");
    const extensions = await prisma.$queryRaw<
      Array<{ extname: string; extversion: string }>
    >`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'pg_trgm';
    `;

    if (extensions.length === 0) {
      console.log("❌ pg_trgm extension NOT found!");
    } else {
      console.log(`✅ pg_trgm extension found (version: ${extensions[0].extversion})`);
    }

    // 2. GIN indexes 확인
    console.log("\n=== 2. GIN Indexes ===");
    const indexes = await prisma.$queryRaw<
      Array<{ tablename: string; indexname: string; indexdef: string }>
    >`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexdef LIKE '%USING gin%'
        AND tablename IN ('Content', 'Tag')
      ORDER BY tablename, indexname;
    `;

    if (indexes.length === 0) {
      console.log("❌ No GIN indexes found!");
    } else {
      console.log(`✅ Found ${indexes.length} GIN index(es):\n`);
      indexes.forEach((idx) => {
        console.log(`  Table: ${idx.tablename}`);
        console.log(`  Index: ${idx.indexname}`);
        console.log(`  Definition: ${idx.indexdef}\n`);
      });
    }

    // 3. 특정 인덱스 상세 정보
    console.log("=== 3. Index Details ===");
    const indexDetails = await prisma.$queryRaw<
      Array<{
        table_name: string;
        index_name: string;
        index_type: string;
        column_name: string;
      }>
    >`
      SELECT
        t.relname AS table_name,
        i.relname AS index_name,
        am.amname AS index_type,
        a.attname AS column_name
      FROM pg_class t
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_am am ON i.relam = am.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      WHERE t.relname IN ('Content', 'Tag')
        AND am.amname = 'gin'
      ORDER BY t.relname, i.relname;
    `;

    if (indexDetails.length === 0) {
      console.log("❌ No GIN index details found!");
    } else {
      console.log(`✅ GIN Index Details:\n`);
      indexDetails.forEach((detail) => {
        console.log(
          `  ${detail.table_name}.${detail.column_name} -> ${detail.index_name} (${detail.index_type})`
        );
      });
    }

    // 4. 요약
    console.log("\n=== Summary ===");
    const hasExtension = extensions.length > 0;
    const hasIndexes = indexes.length >= 3; // title, description, name

    if (hasExtension && hasIndexes) {
      console.log("✅ Full-Text Search optimization is properly configured!");
      console.log(`   - pg_trgm extension: ENABLED`);
      console.log(`   - GIN indexes: ${indexes.length} found`);
    } else {
      console.log("⚠️  Full-Text Search optimization is NOT complete:");
      if (!hasExtension) console.log("   - pg_trgm extension: MISSING");
      if (!hasIndexes)
        console.log(
          `   - GIN indexes: Only ${indexes.length} found (expected 3)`
        );
    }
  } catch (error) {
    console.error("❌ Error during verification:", error);
    throw error;
  }
}

verifyFTS()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
