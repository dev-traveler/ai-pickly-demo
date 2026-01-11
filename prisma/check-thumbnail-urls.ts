import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking current thumbnailUrl values...\n");

  const contents = await prisma.content.findMany({
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
    },
    take: 10,
  });

  console.log("📋 First 10 content records:\n");
  contents.forEach((content) => {
    console.log(`ID: ${content.id}`);
    console.log(`Title: ${content.title.substring(0, 50)}...`);
    console.log(`ThumbnailUrl: ${content.thumbnailUrl || "(null)"}`);
    console.log("---");
  });

  // Count how many have thumbnails
  const withThumbnails = await prisma.content.count({
    where: {
      thumbnailUrl: {
        not: null,
      },
    },
  });

  const total = await prisma.content.count();

  // Count Supabase URLs
  const withSupabase = await prisma.content.count({
    where: {
      thumbnailUrl: {
        contains: "supabase.co/storage",
      },
    },
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total contents: ${total}`);
  console.log(`   With thumbnails: ${withThumbnails}`);
  console.log(`   Without thumbnails: ${total - withThumbnails}`);
  console.log(`   Using Supabase Storage: ${withSupabase}`);
  console.log(`   Using external URLs: ${withThumbnails - withSupabase}`);
}

main()
  .then(() => {
    console.log("\n✨ Check completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Check failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
