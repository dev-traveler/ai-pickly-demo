import { parseAsString, parseAsStringEnum, createLoader } from "nuqs/server";
import { Difficulty } from "@prisma/client";
import { TimeRange } from "@/types/filter";
import { z } from "zod";

export const filtersSearchParams = {
  category: parseAsString, // 카테고리
  difficulty: parseAsStringEnum(Object.values(Difficulty)), // 난이도
  time: parseAsStringEnum(Object.values(TimeRange)), // 소요시간
  tool: parseAsString, // 사용 AI 툴
};

export const contentsSearchParams = {
  ...filtersSearchParams,
  q: parseAsString, // 검색어
  cursor: parseAsString, // 페이지네이션 커서
};

export const loadContentsSearchParams = createLoader(contentsSearchParams);

/**
 * 캐시 키 안정화를 위한 정규화된 검색 파라미터 스키마
 * cursor는 페이지 위치이므로 캐시 키에서 제외
 */
export const normalizedSearchParamsSchema = z.object({
  q: z
    .string()
    .nullish()
    .transform((v) => (v ?? "").trim().toLowerCase()),
  category: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  difficulty: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  time: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  tool: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
});

export type NormalizedSearchParams = z.output<typeof normalizedSearchParamsSchema>;

/**
 * 검색 파라미터를 정규화하여 캐시 키를 안정화합니다.
 * - 대소문자 통일 (q만 lowercase)
 * - 공백 제거
 * - null/undefined를 빈 문자열로 변환
 * - cursor는 정규화 대상이 아님 (필터가 아닌 페이지 위치)
 */
export function normalizeSearchParams(params: {
  q?: string | null;
  category?: string | null;
  difficulty?: string | null;
  time?: string | null;
  tool?: string | null;
}): NormalizedSearchParams {
  return normalizedSearchParamsSchema.parse(params);
}
