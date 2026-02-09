import { describe, it, expect } from "vitest";
import { parseSearchQuery } from "./search-utils";

describe("parseSearchQuery", () => {
  describe("기본 동작", () => {
    it("공백으로 분리된 단어들을 배열로 반환", () => {
      expect(parseSearchQuery("이미지 배경 제거")).toEqual([
        "이미지",
        "배경",
        "제거",
      ]);
    });

    it("여러 공백이 있어도 정상 처리", () => {
      expect(parseSearchQuery("이미지   배경    제거")).toEqual([
        "이미지",
        "배경",
        "제거",
      ]);
    });

    it("앞뒤 공백 제거", () => {
      expect(parseSearchQuery("  이미지 배경  ")).toEqual(["이미지", "배경"]);
    });
  });

  describe("불용어 제거", () => {
    it("독립적인 조사 단어 제거", () => {
      expect(parseSearchQuery("은 는 이 가")).toEqual([]);
    });

    it("공백으로 분리된 조사는 제거", () => {
      expect(parseSearchQuery("이미지 를 제거")).toEqual(["이미지", "제거"]);
    });
  });

  describe("접미사(조사/어미) 제거", () => {
    it("단어 끝 조사 제거: 를, 을, 은, 는 등", () => {
      expect(parseSearchQuery("AI를 활용한 이미지")).toEqual([
        "AI",
        "활용",
        "이미지",
      ]);
    });

    it("단어 끝 어미 제거: 한, 된, 하는, 되는 등", () => {
      expect(parseSearchQuery("생성된 이미지")).toEqual(["생성", "이미지"]);
      expect(parseSearchQuery("만들어지는 영상")).toEqual(["만들어지", "영상"]);
    });

    it("긴 접미사 우선 제거: 으로 vs 로", () => {
      expect(parseSearchQuery("React으로 개발")).toEqual(["React", "개발"]);
      expect(parseSearchQuery("React로 개발")).toEqual(["React", "개발"]);
    });

    it("접미사가 없는 단어는 그대로 유지", () => {
      expect(parseSearchQuery("이미지 배경 제거")).toEqual([
        "이미지",
        "배경",
        "제거",
      ]);
    });

    it("제거 후 1글자 이상 남아야 함", () => {
      // "의"는 접미사지만, 제거하면 빈 문자열이 되므로 그대로 유지 후 불용어로 제거됨
      expect(parseSearchQuery("의 미")).toEqual([]);
    });

    it("조사가 포함된 단어도 어근 추출", () => {
      expect(parseSearchQuery("의미있는 검색")).toEqual(["의미있", "검색"]);
    });
  });

  describe("최소 길이 필터링", () => {
    it("2글자(문자열 길이) 이상 단어만 포함", () => {
      // 한글 1글자는 string.length === 1이므로 필터링됨
      expect(parseSearchQuery("웹 앱")).toEqual([]);
      // 2글자 이상은 포함
      expect(parseSearchQuery("웹앱 개발")).toEqual(["웹앱", "개발"]);
    });

    it("1글자 한글 단어 제외", () => {
      expect(parseSearchQuery("앱 개 발")).toEqual([]);
    });

    it("영문 대문자 약어는 1글자도 허용 (예외)", () => {
      expect(parseSearchQuery("A I")).toEqual(["A", "I"]);
    });

    it("소문자 1글자는 제외", () => {
      expect(parseSearchQuery("a b c")).toEqual([]);
    });

    it("2글자 영문 단어 포함", () => {
      expect(parseSearchQuery("AI is great")).toEqual(["AI", "is", "great"]);
    });
  });

  describe("영문 대문자 약어 처리", () => {
    it("AI, UX, UI 등 약어 정상 처리", () => {
      expect(parseSearchQuery("AI UX UI")).toEqual(["AI", "UX", "UI"]);
    });

    it("혼합된 대소문자는 약어로 인식 안 함", () => {
      expect(parseSearchQuery("Ai Ux")).toEqual(["Ai", "Ux"]);
    });

    it("한글과 영문 약어 혼합", () => {
      expect(parseSearchQuery("AI 이미지 생성")).toEqual([
        "AI",
        "이미지",
        "생성",
      ]);
    });
  });

  describe("중복 제거", () => {
    it("동일한 단어 중복 제거", () => {
      expect(parseSearchQuery("이미지 이미지 배경")).toEqual(["이미지", "배경"]);
    });

    it("대소문자가 다른 경우도 중복으로 처리", () => {
      expect(parseSearchQuery("AI ai Ai")).toEqual(["AI"]);
    });

    it("접미사 제거 후 중복되는 경우 제거", () => {
      // "AI를"과 "AI"는 접미사 제거 후 동일
      expect(parseSearchQuery("AI를 AI 이미지")).toEqual(["AI", "이미지"]);
    });
  });

  describe("최대 단어 수 제한", () => {
    it("5개 초과 시 처음 5개만 반환", () => {
      expect(
        parseSearchQuery("하나 둘째 셋째 넷째 다섯 여섯 일곱")
      ).toEqual(["하나", "둘째", "셋째", "넷째", "다섯"]);
    });

    it("정확히 5개일 때 모두 반환", () => {
      expect(parseSearchQuery("하나 둘째 셋째 넷째 다섯")).toEqual([
        "하나",
        "둘째",
        "셋째",
        "넷째",
        "다섯",
      ]);
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열 처리", () => {
      expect(parseSearchQuery("")).toEqual([]);
    });

    it("공백만 있는 경우", () => {
      expect(parseSearchQuery("   ")).toEqual([]);
    });

    it("null/undefined 처리", () => {
      expect(parseSearchQuery(null as unknown as string)).toEqual([]);
      expect(parseSearchQuery(undefined as unknown as string)).toEqual([]);
    });

    it("숫자 포함 단어", () => {
      expect(parseSearchQuery("GPT4 Claude3")).toEqual(["GPT4", "Claude3"]);
    });

    it("특수문자 포함 단어", () => {
      expect(parseSearchQuery("Next.js React@18")).toEqual([
        "Next.js",
        "React@18",
      ]);
    });
  });

  describe("실제 사용 시나리오", () => {
    it("이미지 편집 관련 검색", () => {
      expect(parseSearchQuery("이미지 배경 제거")).toEqual([
        "이미지",
        "배경",
        "제거",
      ]);
    });

    it("AI 도구 검색", () => {
      // "AI를" → "AI", "활용한" → "활용"
      expect(parseSearchQuery("AI를 활용한 이미지 생성")).toEqual([
        "AI",
        "활용",
        "이미지",
        "생성",
      ]);
    });

    it("프로그래밍 관련 검색", () => {
      // "React로" → "React"
      expect(parseSearchQuery("React로 UI 개발하기")).toEqual([
        "React",
        "UI",
        "개발하기",
      ]);
    });

    it("긴 검색어", () => {
      // "ChatGPT를" → "ChatGPT", "활용한" → "활용"
      expect(
        parseSearchQuery("ChatGPT를 활용한 AI 프롬프트 엔지니어링 기초 입문 강좌")
      ).toEqual(["ChatGPT", "활용", "AI", "프롬프트", "엔지니어링"]);
    });

    it("복잡한 조사가 붙은 검색어", () => {
      expect(parseSearchQuery("서울에서 부산까지 여행")).toEqual([
        "서울",
        "부산",
        "여행",
      ]);
    });
  });
});
