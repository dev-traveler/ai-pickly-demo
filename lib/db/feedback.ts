"use server";

import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/utils/email-validator";
import { getErrorInfo } from "@/lib/utils/error-utils";

export type FeedbackResult =
  | { success: true }
  | {
      success: false;
      error: "INVALID_EMAIL" | "EMPTY_REQUEST" | "DATABASE_ERROR";
    };

/**
 * 콘텐츠 피드백 제출 Server Action
 * @param email 사용자가 입력한 이메일
 * @param request 사용자가 원하는 작업/카테고리 요청
 * @returns 성공 여부 및 에러 정보
 */
export async function submitContentFeedback(
  email: string,
  request: string,
): Promise<FeedbackResult> {
  // 이메일 정규화: 공백 제거 및 소문자 변환
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRequest = request.trim();

  // 서버 사이드 유효성 검사
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: "INVALID_EMAIL" };
  }

  if (!normalizedRequest || normalizedRequest.length === 0) {
    return { success: false, error: "EMPTY_REQUEST" };
  }

  try {
    await prisma.contentFeedback.create({
      data: {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        request: normalizedRequest,
      },
    });

    return { success: true };
  } catch (error) {
    const { code, message } = getErrorInfo(error);
    // Handle connection pool exhaustion
    if (
      code === "P2024" ||
      message?.includes("max clients") ||
      message?.includes("Connection")
    ) {
      console.error("Database connection pool exhausted:", {
        message,
        code,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: "DATABASE_ERROR" };
    }
    // 기타 데이터베이스 에러
    console.error("Content feedback submission error:", error);
    return { success: false, error: "DATABASE_ERROR" };
  }
}
