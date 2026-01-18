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
    id: string;
    name: string;
    slug: string;
  }[];
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  aiTools: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  }[];
};
