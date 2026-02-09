/**
 * 검색 쿼리 파싱 유틸리티
 * 단어별 AND 검색을 위한 쿼리 전처리 함수
 */

// 한글 불용어 목록 (독립적인 조사 단어)
const KOREAN_STOPWORDS = new Set([
  "은",
  "는",
  "이",
  "가",
  "을",
  "를",
  "의",
  "에",
  "와",
  "과",
  "로",
  "으로",
]);

// 단어 끝에 붙는 접미사 (조사, 어미)
// 긴 것부터 정렬하여 "으로"가 "로"보다 먼저 매칭되도록 함
const KOREAN_SUFFIXES = [
  // 3글자 어미/조사
  "에서",
  "까지",
  "부터",
  "만큼",
  "처럼",
  "같이",
  "으로",
  "하는",
  "되는",
  "에게",
  "한테",
  "보다",
  // 2글자 어미/조사
  "을",
  "를",
  "은",
  "는",
  "이",
  "가",
  "의",
  "에",
  "와",
  "과",
  "로",
  "도",
  "만",
  "한",
  "된",
];

// 설정 상수
const MIN_WORD_LENGTH = 2; // 최소 단어 길이
const MAX_SEARCH_WORDS = 5; // 최대 검색 단어 수

/**
 * 영문 대문자 약어인지 확인 (예: AI, UX, UI)
 */
function isUppercaseAcronym(word: string): boolean {
  return /^[A-Z]+$/.test(word);
}

/**
 * 단어 끝에 붙은 한글 접미사(조사/어미)를 제거합니다.
 * 제거 후 남은 부분이 최소 길이 이상일 때만 제거합니다.
 *
 * @param word - 원본 단어
 * @returns 접미사가 제거된 단어
 *
 * @example
 * removeSuffix("AI를") // "AI"
 * removeSuffix("활용한") // "활용"
 * removeSuffix("이미지") // "이미지" (접미사 없음)
 */
function removeSuffix(word: string): string {
  for (const suffix of KOREAN_SUFFIXES) {
    if (word.endsWith(suffix)) {
      const stem = word.slice(0, -suffix.length);
      // 제거 후 최소 1글자 이상 남아야 함
      if (stem.length >= 1) {
        return stem;
      }
    }
  }
  return word;
}

/**
 * 검색 쿼리를 파싱하여 검색에 사용할 단어 배열을 반환합니다.
 *
 * 처리 과정:
 * 1. 공백으로 분리
 * 2. 독립적인 불용어 단어 제거
 * 3. 단어 끝 접미사(조사/어미) 제거
 * 4. 최소 길이 필터링 (영문 대문자 약어는 예외)
 * 5. 중복 제거
 * 6. 최대 개수 제한
 *
 * @param query - 원본 검색 쿼리
 * @returns 검색에 사용할 단어 배열
 *
 * @example
 * parseSearchQuery("이미지 배경 제거") // ["이미지", "배경", "제거"]
 * parseSearchQuery("AI를 활용한 이미지") // ["AI", "활용", "이미지"]
 * parseSearchQuery("웹앱 개발") // ["웹앱", "개발"]
 */
export function parseSearchQuery(query: string): string[] {
  if (!query || typeof query !== "string") {
    return [];
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return [];
  }

  // 1. 공백으로 분리
  const words = trimmed.split(/\s+/);

  // 2-5. 불용어 제거, 접미사 제거, 최소 길이 필터링, 중복 제거
  const seen = new Set<string>();
  const filtered: string[] = [];

  for (const word of words) {
    // 2. 독립적인 불용어 단어 제거
    if (KOREAN_STOPWORDS.has(word)) {
      continue;
    }

    // 3. 단어 끝 접미사 제거
    const processed = removeSuffix(word);

    // 4. 최소 길이 필터링 (영문 대문자 약어는 1글자도 허용)
    if (processed.length < MIN_WORD_LENGTH && !isUppercaseAcronym(processed)) {
      continue;
    }

    // 5. 중복 제거 (소문자로 비교)
    const lowerWord = processed.toLowerCase();
    if (seen.has(lowerWord)) {
      continue;
    }
    seen.add(lowerWord);

    filtered.push(processed);
  }

  // 6. 최대 개수 제한
  return filtered.slice(0, MAX_SEARCH_WORDS);
}
