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

export type UnsubscribeResult =
  | { success: true }
  | {
      success: false;
      error: "INVALID_EMAIL" | "EMAIL_NOT_FOUND" | "DATABASE_ERROR";
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
    const result = await prisma.$queryRaw<{ isActive: boolean }[]>(
      Prisma.sql`
        INSERT INTO "NewsletterSubscriber" (id, email, "isActive", "statusChangedAt")
        VALUES (${crypto.randomUUID()}, ${normalizedEmail}, true, CURRENT_TIMESTAMP)
        ON CONFLICT (email)
        DO UPDATE SET
          "isActive" = true,
          "statusChangedAt" = CURRENT_TIMESTAMP
        WHERE "NewsletterSubscriber"."isActive" = false
        RETURNING "isActive";
      `
    );

    if (result.length === 0) {
      return { success: false, error: "DUPLICATE_EMAIL" };
    }

    return { success: true };
  } catch (error) {
    // 기타 데이터베이스 에러
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "DATABASE_ERROR" };
  }
}

/**
 * 뉴스레터 구독 취소 Server Action
 * @param email 사용자가 입력한 이메일
 * @returns 성공 여부 및 에러 정보
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<UnsubscribeResult> {
  // 이메일 정규화: 공백 제거 및 소문자 변환
  const normalizedEmail = email.trim().toLowerCase();

  // 서버 사이드 유효성 검사
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: "INVALID_EMAIL" };
  }

  try {
    // NewsletterSubscriber 테이블에서 해당 이메일 찾아서 isActive를 false로 변경
    const result = await prisma.newsletterSubscriber.updateMany({
      where: {
        email: normalizedEmail,
        isActive: true,
      },
      data: {
        isActive: false,
        statusChangedAt: new Date(),
      },
    });

    // 업데이트된 레코드가 없으면 이메일이 존재하지 않거나 이미 구독 취소된 상태
    if (result.count === 0) {
      return { success: false, error: "EMAIL_NOT_FOUND" };
    }

    return { success: true };
  } catch (error) {
    // 기타 데이터베이스 에러
    console.error("Newsletter unsubscription error:", error);
    return { success: false, error: "DATABASE_ERROR" };
  }
}
