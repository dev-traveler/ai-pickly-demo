import { Difficulty } from "@prisma/client";

export type ContentCardData = {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: Date;
  thumbnailUrl: string | null;
  sourceUrl: string;
  difficulty: Difficulty;
  estimatedTime?: {
    displayMinutes: number | null;
  } | null;
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  aiTools: {
    aiTool: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
};
