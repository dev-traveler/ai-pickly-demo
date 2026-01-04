"use server";

import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/utils/email-validator";
import { Prisma } from "@prisma/client";

export type SubscribeResult =
  | { success: true }
  | {
      success: false;
      error: "INVALID_EMAIL" | "DUPLICATE_EMAIL" | "DATABASE_ERROR";
    };

/**
 * 뉴스레터 구독 Server Action
 * @param email 사용자가 입력한 이메일
 * @returns 성공 여부 및 에러 정보
 */
export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResult> {
  // 이메일 정규화: 공백 제거 및 소문자 변환
  const normalizedEmail = email.trim().toLowerCase();

  // 서버 사이드 유효성 검사
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: "INVALID_EMAIL" };
  }

  try {
    // NewsletterSubscriber 테이블에 데이터 삽입
    await prisma.newsletterSubscriber.create({
      data: {
        id: crypto.randomUUID(),
        email: normalizedEmail,
      },
    });

    return { success: true };
  } catch (error) {
    // Prisma 에러 핸들링
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint violation (중복 이메일)
      if (error.code === "P2002") {
        return { success: false, error: "DUPLICATE_EMAIL" };
      }
    }

    // 기타 데이터베이스 에러
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "DATABASE_ERROR" };
  }
}
