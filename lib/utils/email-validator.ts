/**
 * 이메일 유효성 검증 함수
 * @param email 검사할 이메일 문자열
 * @returns 유효하면 true, 아니면 false
 */
export function isValidEmail(email: string): boolean {
  // RFC 5321 기준 최대 길이
  const MAX_EMAIL_LENGTH = 254;
  const MAX_LOCAL_LENGTH = 64;

  // 빈 값, null/undefined, 길이 초과 체크
  if (!email || email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  // 이메일 정규식:
  // - local part: 영문, 숫자, .-_+ 허용, 점으로 시작/끝 불가, 연속된 점 불가
  // - domain: 영문, 숫자, 하이픈 허용, 하이픈으로 시작/끝 불가
  // - TLD: 최소 2자 이상의 영문
  const emailRegex =
    /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // local part 길이 검증
  const [localPart] = email.split("@");
  if (localPart.length > MAX_LOCAL_LENGTH) {
    return false;
  }

  // 연속된 점 체크
  if (localPart.includes("..")) {
    return false;
  }

  // 점으로 시작하거나 끝나는지 체크
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return false;
  }

  return true;
}
