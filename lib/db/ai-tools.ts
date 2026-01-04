"use server";

import { prisma } from "@/lib/prisma";

export interface AIToolData {
  id: string;
  name: string;
  slug: string;
}

/**
 * 데이터베이스에서 모든 AI 툴 목록을 가져옵니다.
 * FilterSheet의 AI 툴 필터에서 사용됩니다.
 */
export async function getAITools(): Promise<AIToolData[]> {
  const aiTools = await prisma.aITool.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return aiTools;
}
