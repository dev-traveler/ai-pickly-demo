import { parseAsString, parseAsStringEnum, createLoader } from "nuqs/server";
import { Difficulty } from "@prisma/client";
import { TimeRange } from "@/types/filter";

export const filtersSearchParams = {
  category: parseAsString, // 카테고리
  difficulty: parseAsStringEnum(Object.values(Difficulty)), // 난이도
  time: parseAsStringEnum(Object.values(TimeRange)), // 소요시간
  tool: parseAsString, // 사용 AI 툴
};

export const contentsSearchParams = {
  ...filtersSearchParams,
  q: parseAsString, // 검색어
};

export const loadContentsSearchParams = createLoader(contentsSearchParams);
