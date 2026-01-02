import { FileText, Image, Video, Code } from "lucide-react";
import type { Difficulty, TimeRange } from "@/lib/stores/filter-store";

export interface CategoryOption {
  id: string;
  label: string;
  icon: any; // lucide-react icon component
}

export const CATEGORIES: CategoryOption[] = [
  { id: "text", label: "텍스트 생성", icon: FileText },
  { id: "image", label: "이미지 생성", icon: Image },
  { id: "video", label: "영상 생성", icon: Video },
  { id: "code", label: "바이브 코딩", icon: Code },
];

export interface DifficultyOption {
  value: Difficulty;
  label: string;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: "BEGINNER", label: "초급" },
  { value: "INTERMEDIATE", label: "중급" },
  { value: "ADVANCED", label: "고급" },
];

export interface TimeRangeOption {
  value: TimeRange;
  label: string;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: "5", label: "5분 미만" },
  { value: "10", label: "5-10분" },
  { value: "30", label: "10-30분" },
  { value: "30+", label: "30분 이상" },
];

// AI Tool options - these would typically come from the database
// For now, we'll use a static list based on the screenshot
export interface AIToolOption {
  id: string;
  label: string;
}

export const POPULAR_AI_TOOLS: AIToolOption[] = [
  { id: "chatgpt", label: "Chat GPT" },
  { id: "cursor", label: "Cursor" },
  { id: "freepik", label: "Freepik" },
  { id: "gemini", label: "Gemini" },
  { id: "google-notebook-lm", label: "Google Notebook LM" },
  { id: "lovable", label: "Lovable" },
  { id: "midjourney", label: "Midjourney" },
  { id: "ponder-ai", label: "Ponder AI" },
  { id: "perplexity", label: "Perplexity" },
  { id: "replit", label: "Replit" },
];
