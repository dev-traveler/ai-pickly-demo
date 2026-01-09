import type { Difficulty, TimeRange } from "@/lib/stores/filter-store";

// 공통 필터 파라미터 (많은 이벤트에 포함됨)
export interface FilterParams {
  categories: string[];
  difficulty: Difficulty | null;
  time: TimeRange | null;
  tools: string | null;
  q: string;
}

// 온보딩 이벤트
export interface OnboardingStepImpressionProps {
  step_index: number;
  total_steps: number;
}

export interface OnboardingNavigationClickProps {
  direction: "prev" | "next";
  from_step: number;
  to_step: number;
}

export interface OnboardingPaginationClickProps {
  pre_step: number;
  next_step: number;
}

export interface OnboardingCloseClickProps {
  current_step: number;
}

// 홈페이지 이벤트
export interface PageViewProps {
  referrer: string;
}

export interface LogoClickProps extends FilterParams {
  location: "header" | "footer";
}

export interface SearchProps extends FilterParams {
  keyword: string;
}

// 필터 이벤트
export interface CategoryClickProps extends FilterParams {
  category_id: string;
  name: string;
  position: number;
}

export interface FilterChipRemoveProps extends FilterParams {
  filter_id: string;
  filter_type: "category" | "difficulty" | "time" | "tool";
  name: string;
}

export interface FilterSheetOpenProps {
  is_open: boolean;
}

export interface FilterOptionClickProps extends FilterParams {
  option_id: string;
  option_type: "category" | "difficulty" | "time" | "tool";
  name: string;
  position: number;
}

// 콘텐츠 이벤트
export interface ContentCardImpressionProps {
  content_id: string;
  title: string;
  position: number;
}

export interface ContentCardClickProps {
  content_id: string;
  title: string;
  position: number;
  search_category: string[];
}

// 뉴스레터 모달 이벤트
export interface NewsletterModalOpenProps {
  is_open: boolean;
}

export interface NewsletterPolicyLinkClickProps {
  link_id: string;
  name: string;
}

// 푸터 이벤트
export interface FooterLinkClickProps {
  link_id: string;
  name: string;
  position: number;
}
