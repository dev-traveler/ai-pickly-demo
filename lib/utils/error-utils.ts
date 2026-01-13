export function getErrorInfo(error: unknown): {
  code?: string;
  message?: string;
} {
  if (error instanceof Error) {
    return { message: error.message };
  }
  if (typeof error === "object" && error !== null) {
    const maybeCode = (error as { code?: unknown }).code;
    const maybeMessage = (error as { message?: unknown }).message;
    return {
      code: typeof maybeCode === "string" ? maybeCode : undefined,
      message: typeof maybeMessage === "string" ? maybeMessage : undefined,
    };
  }
  return {};
}
